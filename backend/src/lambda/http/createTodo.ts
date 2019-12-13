import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getuserId } from '../../BusinessLogic/userauthentication'
import * as uuid from 'uuid'
import { createtodo } from '../../DataLayer/ToDoAccess'

const logger = createLogger('createtodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const ToDoTable = process.env.ToDo_TABLE
  const userId = getuserId(event)
  const todoId = uuid.v4()
  logger.info("key", todoId)
  const newTodoitem = await createtodo(userId, newTodo, todoId)
  let statusCode = 201
      if (!newTodoitem) {
        logger.error("Unable to create To Do")
        statusCode = 404
    } else {
        logger.info("CreateItem succeeded:")
      }
  logger.info("newTodoitem", newTodoitem)
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

  
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06      
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-3193378732-1992673?contextType=room
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
 
 
