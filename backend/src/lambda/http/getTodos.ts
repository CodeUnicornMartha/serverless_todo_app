import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { TableName } from 'aws-sdk/clients/dynamodb'
//import { verifyToken } from '../auth/auth0Authorizer'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { parseUserId } from '../../auth/utils'
import { getuserId } from '../../BusinessLogic/userauthentication'

const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('gettodo')
const ToDoTable: TableName = process.env.ToDo_TABLE
const UserIdINDEX = process.env.UserIdINDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  //const authorization = event.headers.Authorization
  //const split = authorization.split(' ')
  //const jwtToken = split[1]
  //const userId = parseUserId(jwtToken)
  const userId = getuserId(event)

  const result = await docClient.query({
    TableName: ToDoTable,
    IndexName: UserIdINDEX,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
      //RangeKey: createdAt
    }
  }).promise()
  logger.info("result", result)
    
  var statusCode = 201
  if (!result) {
    logger.error("Unable to get ToDos")
    statusCode = 404
  } 
  else {
    logger.info("GetToDos succeeded:")
    }
  const items = result.Items
  logger.info("items",items)
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}

  /*item: {
        TableName: ToDoTable,
        userid: userid
        //IndexName: ToDoIdIndex
      }
      */
 // TODO: Get all TODO items for a current user
   // TODO: Get all TODO items for a current user
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  //const todoId = event.pathParameters.todoId
  //const createdAt = event.pathParameters.createdAt
  //UserIdIndex
//const todoId = JSON.parse(event.body).id
  //const allitems = {
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property
  /*
  var params = {
      TableName: ToDoTable,
      IndexName: ToDoIdIndex,
      KeyConditionExpression: 'HashKey = :todoId and RangeKey > :createdAt',
      ExpressionAttributeValues: {
        HashKey: todoId,
        RangeKey: createdAt
      }
    };
    const result = await docClient.query(params).promise()
    logger.info("result", result) 
    */
    /*
    const result = await docClient.scan({
    TableName: ToDoTable
    }).promise()
    */
//const items = result.Items
  //logger.info("items",items)

        // TODO: Remove a TODO item by id
        // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
        // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
    //todoId: todoId,
   // KeyConditionExpression: 'to = :imageId',
    //ExpressionAttributeValues: {
     //     ':todoId': todoId
      //}
  //}
  //const authorization = event.headers.authorization
  //waiting for promise
  //const jwtToken = await verifyToken(authorization)

  
     /*
     const result = await docClient.scan({
    TableName: ToDoTable
  }).promise()
  logger.info("result", result)
     /*
      Key: {
        todoId: todoId
      }
     */      
      
  

