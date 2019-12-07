import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { verifyToken } from '../auth/auth0Authorizer'
//import { promises } from 'fs'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.ToDo_TABLE
const logger = createLogger('deleteToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  //const authorization = event.headers.authorization
  //const jwt = await verifyToken(authorization)
  logger.info("todoid", todoId)

  const result = await docClient.delete({
    TableName: ToDoTable,
    Key: {
      todoId: todoId
        //userId: jwt.sub
      }
  }).promise()
  logger.info("result", result)
  var statusCode = 200
  if (!result) {
    logger.error("Unable to delete To Do")
    statusCode = 404
  } 
  else {
    logger.info("DeleteItem succeeded:")
  }
  logger.info("result2", result)
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
      result
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
  // TODO: Remove a TODO item by id
  return undefined
}

*/
