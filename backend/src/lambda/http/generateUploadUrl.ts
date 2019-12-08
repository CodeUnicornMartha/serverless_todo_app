
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { loggers } from 'winston'
import { createLogger } from '../../utils/logger'


const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({ signatureVersion: 'v4'})

const ToDoTable = process.env.GROUPS_TABLE
const bucketName = process.env.ToDo_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('generateuploadurl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const validToDoId = await ToDoExists(todoId)

  if (!validToDoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'ToDo does not exist'
      })
    }
  }

  //Business Logic - Permission to access data authentication - BUsiness Logic - Controller
  // Data Layer - Dynamo DB - Models
  // http - View

  // Upload a file via S3
  const url = getUploadUrl(todoId)
  const file = uploadFile(todoId, event)
  //const image = s3.putObject(url)
  logger.info("file", file)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      todoId: todoId,
      attachmentUrl: url,
      file: file
    })
  }
}

async function ToDoExists(todoId: string) {
  const result = await docClient.get({
      TableName: ToDoTable,
      Key: {
        todoId: todoId
      }
    }).promise()

  console.log('Get ToDo: ', result)
  return !!result.Item
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    TableName: ToDoTable,
    Key: todoId,
    Expires: urlExpiration
  })
}


async function uploadFile(todoId: string, event: any) {
  const timestamp = new Date().toISOString()
  const newFile = JSON.parse(event.body)

  const newItem = {
    //groupId,
    timestamp: timestamp,
    Key:  {
      todoId: todoId,
    },    
    ...newFile,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
  logger.info("newItem", newItem)
  //console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: ToDoTable,
      Item: newItem
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      Item: newItem,
      TableName: ToDoTable
    })
    
  }
}


/*
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  var temp = event
  console.log(temp)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return undefined
}
*/
