import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

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

export async function ToDoExists(todoId: string, userId: string) {
    const ToDoTable = process.env.ToDo_TABLE
    const docClient = new AWS.DynamoDB.DocumentClient()
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
  
 export function getUploadUrl(todoId: string) {
    const s3 = new AWS.S3({ signatureVersion: 'v4'})
    const bucketName = process.env.ToDo_S3_BUCKET
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
  }
export async function updateuploadurl(todoId: string, userId: string, uploadUrl: string){
    const ToDoTable = process.env.ToDo_TABLE
    const docClient = new AWS.DynamoDB.DocumentClient()
    const resultuploadurldb = await docClient.update({
        TableName: ToDoTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set uploadUrl = :uploadUrl',
        ExpressionAttributeValues: {
        ':uploadUrl': uploadUrl
      },
      ReturnValues: "UPDATED_NEW"
      })
      .promise()
    logger.info("resultuploadurldb", resultuploadurldb)
    return resultuploadurldb
}
export async function updatetodo( updatedTodo: UpdateTodoRequest, todoId: string, userId: string){
  const ToDoTable = process.env.ToDo_TABLE
  const docClient = new AWS.DynamoDB.DocumentClient()
  const todoname = updatedTodo.name
  const done = updatedTodo.done
  const dueDate = updatedTodo.dueDate

  const resultupdatedata = await docClient.update({
    TableName: ToDoTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
    UpdateExpression: 'set todoname = :todoname, done = :done, dueDate = :dueDate',
    ExpressionAttributeValues: {
      ':todoname': todoname,
      ':done': done,
      ':dueDate': dueDate

    },
    ReturnValues: "UPDATED_NEW"     
      
  }).promise();

  logger.info("result", resultupdatedata)

  return resultupdatedata
  
}