import 'source-map-support/register'



import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

//import {TodoItem} from '../../models/TodoItem'

//import * as AWS  from 'aws-sdk'

//mport { verifyToken } from '../auth/auth0Authorizer'

//import { PresignedPost } from 'aws-sdk/clients/s3'

//import { parseUserId } from '../../auth/utils'
import { getuserId } from '../../BusinessLogic/userauthentication'

import * as uuid from 'uuid'

//import { Response } from 'aws-sdk'
import { createtodo } from '../../DataLayer/ToDoAccess'









//const docClient = new AWS.DynamoDB.DocumentClient()

//const ToDoTable = process.env.ToDo_TABLE

const logger = createLogger('createtodo')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const ToDoTable = process.env.ToDo_TABLE
  
  //const authorization = event.headers.Authorization
  //const split = authorization.split(' ')
  //const jwtToken = split[1]
  //const userId = parseUserId(jwtToken)
  const userId = getuserId(event)
 
  const todoId = uuid.v4()
  logger.info("key", todoId)
  //const UserIdINDEX = process.env.UserIdINDEX
  /*const newTodoitem = {
    userId: userId,
    createdAt: timestamp,
    todoId: todoId,
    name: newTodo.name,
    dueDate: newTodo.dueDate
  }
  */
  const newTodoitem = await createtodo(userId, newTodo, todoId)
  
  /*
  
  logger.info("newitem", newTodoitem)
  const result = await docClient.put({
      TableName: ToDoTable,
      Item: newTodoitem      
    }).promise()
  logger.info("result", result)
    */
    var statusCode = 201
      if (!newTodoitem) {
        logger.error("Unable to create To Do")
        statusCode = 404
    } else {
        logger.info("CreateItem succeeded:")
      }
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: {
          todoId: todoId,
          TableName: ToDoTable,
          userId: userId,
          ... newTodoitem
        }
      })

    }

  }

   //attachmentUrl: detailstodo.attachmentUrl,
  //const jwtToken = await verifyToken(authorization)

  //const detailstodo: TodoItem = JSON.parse(event.body)
  
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  //const userid = event.pathParameters.jwtToken.sub


/*import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import {TodoItem} from '../../models/TodoItem'
import * as AWS  from 'aws-sdk'
//mport { verifyToken } from '../auth/auth0Authorizer'
//import { PresignedPost } from 'aws-sdk/clients/s3'
import { parseUserId } from '../../auth/utils'
import * as uuid from 'uuid'

//import { Response } from 'aws-sdk'




const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.ToDo_TABLE
const logger = createLogger('createtodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const createdAt = (new Date()).toISOString()
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  //const userid = event.pathParameters.jwtToken.sub
  const authorization = event.headers.Authorization
  //const done = event.pathParameters.done
  //const attachmentUrl = event.pathParameters.attachmentUrl
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userid = parseUserId(jwtToken)
  //const jwtToken = await verifyToken(authorization)
  //const detailstodo: TodoItem = JSON.parse(event.body)
  const todoId = uuid.v4()
  logger.info("key", todoId)

  const newTodoitem = {
    Key: {    
    todoId: todoId,
    userid: userid
    },
    createdAt: createdAt,
    //done: done,
    name: newTodo.name,
    //attachmentUrl: attachmentUrl,
    dueDate: newTodo.dueDate
  }
  logger.info("newitem", newTodoitem)
  const result = await docClient.put({
      TableName: ToDoTable,
      Item: newTodoitem,
    }).promise()
  logger.info("result", result)
    var statusCode = 201
      if (!result) {
        logger.error("Unable to create To Do")
        statusCode = 404
    } else {
        logger.info("CreateItem succeeded:")
      }
   
    //const items = result.Attributes.items
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        Item: newTodoitem,
        TableName: ToDoTable,
        ... newTodoitem
        /*item: {

          todoId: todoId,

          TableName: ToDoTable,

          userid: userid,

          ... newTodoitem

        }
        
      })
    }
  }
  */

          //result
        //https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-3193378732-1992673?contextType=room
        //Response: 

  // TODO: Remove a TODO item by id
          // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
          // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  
  //const id = uuid.v4()

  // TODO: Implement creating a new TODO item
 //const ToDoId: CreateTodoRequest = uuid.v4()
  //const ParsingnewToDo: CreateTodoRequest = JSON.parse(event.body)

  //const parseBody = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  //const authorization = event.headers.authorization
  //waiting for promise
  //const jwtToken = await verifyToken(authorization)