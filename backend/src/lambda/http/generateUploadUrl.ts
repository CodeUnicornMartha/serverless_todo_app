
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { loggers } from 'winston'
import { createLogger } from '../../utils/logger'
//import { parseUserId } from '../../auth/utils'
//import * as uuid from 'uuid'
import { getuserId } from '../../BusinessLogic/userauthentication'

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({ signatureVersion: 'v4'})

const ToDoTable = process.env.ToDo_TABLE
const bucketName = process.env.ToDo_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('generateuploadurl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  //const authorization = event.headers.Authorization
  //const split = authorization.split(' ')
  //const jwtToken = split[1]
  //const userId = parseUserId(jwtToken)
  const userId = getuserId(event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const validToDoId = await ToDoExists(todoId, userId)
  logger.info("validtodoid", validToDoId)

  if (!validToDoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'ToDo does not exist'
      })
    }
  }
  const uploadUrl = getUploadUrl(todoId)
  logger.info("url", uploadUrl)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}

async function ToDoExists(todoId: string, userId: string) {
  const result = await docClient.get({
      TableName: ToDoTable,
      Key: {
        todoId: todoId,
        //createdAt: createdAt,
        userId: userId
      }
    }).promise()

  logger.info('Get ToDo: ', result)
  return !!result.Item
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}

  //const uploadUrl = await uploadFile(todoId, userId, fileid)
  //logger.info("attachmentUrl", uploadUrl)
  //const image = s3.putObject(url)
  //logger.info("file", file)

//https://winterwindsoftware.com/serverless-photo-upload-api/
  //const fileid = uuid.v4()
  //JSON.parse(event.body || '{}')
  //
  //const createdAt = event.pathParameters.createdAt
/*
async function uploadFile(todoId: string, userId: string, fileid: string) {
 // const newFile = JSON.parse(event.body)
  let uploadUrl = `https://${bucketName}.s3.amazonaws.com/${fileid}`
  const newItem = { 
    todoId: todoId,
      //createdAt: createdAt,
    userId: userId,
   // ... newFile,
   uploadUrl: uploadUrl
  }
  logger.info("newItem", newItem)
  const result = await docClient.update({
                  TableName: ToDoTable,
                  Key: {
                    todoId: todoId,
                    userId: userId
                  },
                  UpdateExpression: 'set uploadUrl = :uploadUrl',
                  ExpressionAttributeValues: {
                  ':uploadUrl': uploadUrl
                  //RangeKey: createdAt
                },
                ReturnValues: "UPDATED_NEW"
                })
                .promise()
  /*
  const result = await docClient.update({
                  TableName: ToDoTable,
                  Key: {
                    todoId: todoId,
                    userId: userId
                  },
                  UpdateExpression: 'set uploadUrl = :uploadUrl',
                  ExpressionAttributeValues: {
                  ':uploadUrl': uploadUrl
                  //RangeKey: createdAt
                },
                ReturnValues: "UPDATED_NEW"
                })
                .promise()
    
  logger.info("result", result)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}
*/



    //Item: newItem,
      //TableName: ToDoTable,
      //   ... newItem
    
      //todoId: todoId,
      //TableName: ToDoTable,
      //createdAt: createdAt,
      //userId: userId,
      //attachmentUrl: url
      //... file

  //console.log('Storing new item: ', newItem)
  //Business Logic - Permission to access data authentication - BUsiness Logic - Controller
  // Data Layer - Dynamo DB - Models
  // http - View

  // Upload a file via S3
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
