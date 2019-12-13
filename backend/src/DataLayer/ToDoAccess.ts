import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'

const logger = createLogger('DataLayer')

export async function createtodo(userId: string, todo: CreateTodoRequest, todoId: string) {
    const docClient = new AWS.DynamoDB.DocumentClient
    const timestamp = (new Date()).toISOString()
    const ToDoTable = process.env.ToDo_TABLE
    const newTodoitem = {
        userId: userId,
        createdAt: timestamp,
        todoId: todoId,
        name: todo.name,
        dueDate: todo.dueDate
      }
      logger.info("newTodoitem", newTodoitem)
    const resultcreatedata = await docClient.put({
        TableName: ToDoTable,
        Item: newTodoitem      
      }).promise()
    logger.info("resultcreate", resultcreatedata)
    return newTodoitem
}

export async function deletetodo(userId: string, todoId: string) {
    const docClient = new AWS.DynamoDB.DocumentClient
    const ToDoTable = process.env.ToDo_TABLE
    const Key = {
        todoId: todoId,
        //createdAt: createdAt,
        userId: userId
        }
    logger.info("Key", Key)
    const resultdeletedata = await docClient.delete({
        TableName: ToDoTable,
        Key: Key
      }).promise()
      logger.info("resultdelete", resultdeletedata)

      return resultdeletedata
}

export async function gettodos(userId: string){
    const docClient = new AWS.DynamoDB.DocumentClient
    const ToDoTable = process.env.ToDo_TABLE
    const UserIdINDEX = process.env.UserIdINDEX
    const resultgetdata = await docClient.query({
        TableName: ToDoTable,
        IndexName: UserIdINDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
          //RangeKey: createdAt
        }
      }).promise()
      logger.info("result", resultgetdata)
    
    return resultgetdata
}

