
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.ToDo_TABLE
const logger = createLogger('updatetodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  

  const result = await docClient.update({

      TableName: ToDoTable,
      Key: {
        id: todoId
      },
      ExpressionAttributeValues: updatedTodo
      //export type UpdateExpression = string;
     
  }).promise();
  
  var statusCode = 201
  if (!result) {
    logger.error("Unable to update ToDos")
    statusCode = 404
} else {
    logger.info("UpdateToDo succeeded:")

  }
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

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

//import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  //const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  var temp = event
  console.log(temp)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return undefined
}
*/