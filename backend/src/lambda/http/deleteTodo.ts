import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { verifyToken } from '../auth/auth0Authorizer'
//import { promises } from 'fs'
import { createLogger } from '../../utils/logger'
//import { parseUserId } from '../../auth/utils'


const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.ToDo_TABLE
const logger = createLogger('deleteToDo')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
 // const authorization = event.headers.Authorization
 // const split = authorization.split(' ')
  //const jwtToken = split[1]
  const userid = event.pathParameters.userId
  logger.info("userid", userid)
  //parseUserId(jwtToken)
  const todoId = event.pathParameters.todoId
  logger.info("todoid", todoId)
 
  const Key = {
    todoId: todoId,
    userId: userid
    }
  logger.info("Key", Key)

  const result = await docClient.delete({
    TableName: ToDoTable,
    Key: Key
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
  //const items = result.Attributes.DeleteItem
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: "Removing item"

  }
}
    /*body: JSON.stringify({
      items: {
        TableName: ToDoTable,
        userId: userid
        //todoId: todoId

      }
    
    })
    */
  


  //logger.info("result2", result)
        // TODO: Remove a TODO item by id
        // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
        // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room

  
/*
 //const todoId = JSON.parse(event.body).todoId
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  //const authorization = event.headers.authorization
  //const jwt = await verifyToken(authorization)
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-2c214fc0-8307-11e9-8c0b-bb3f327e9dbb-1503309?contextType=room
  //const userid = event.pathParameters.jwtToken.sub
  //const authorization = event.headers.authorization
  //waiting for promise
  //const jwtToken = await verifyToken(authorization)
  //logger.info("todoid", todoId)
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
