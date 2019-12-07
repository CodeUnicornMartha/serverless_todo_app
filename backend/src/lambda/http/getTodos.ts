import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { TableName } from 'aws-sdk/clients/dynamodb'
//import { verifyToken } from '../auth/auth0Authorizer'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('gettodo')
const ToDoTable: TableName = process.env.ToDo_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
   // TODO: Get all TODO items for a current user
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  //const todoId = event.pathParameters.todoId
  logger.info('Processing event: ', event)
  //const todoId = JSON.parse(event.body).id
  //const allitems = {
    
    //todoId: todoId,
   // KeyConditionExpression: 'to = :imageId',
    //ExpressionAttributeValues: {
     //     ':todoId': todoId
      //}
  //}
  //const authorization = event.headers.authorization
  //waiting for promise
  //const jwtToken = await verifyToken(authorization)

  const result = await docClient.scan({
    TableName: ToDoTable
  }).promise()
  logger.info("result", result)
     /*
      Key: {
        todoId: todoId
      }
     */      
      
  

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

        // TODO: Remove a TODO item by id
        // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
        // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
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
