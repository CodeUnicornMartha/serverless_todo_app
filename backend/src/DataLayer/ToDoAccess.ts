import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'


export async function createtodo(userId: string, todo: CreateTodoRequest, todoId: string) {
    const docClient = new AWS.DynamoDB.DocumentClient
    const timestamp = (new Date()).toISOString()
    const ToDoTable = process.env.ToDo_TABLE
    const logger = createLogger('createtodoDataLayer')
    const newTodoitem = {
        userId: userId,
        createdAt: timestamp,
        todoId: todoId,
        name: todo.name,
        dueDate: todo.dueDate
      }
    const result = await docClient.put({
        TableName: ToDoTable,
        Item: newTodoitem      
      }).promise()
    logger.info("result", result)
    return newTodoitem
}