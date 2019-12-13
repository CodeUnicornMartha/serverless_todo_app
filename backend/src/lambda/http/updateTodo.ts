import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getuserId } from '../../BusinessLogic/userauthentication'
import { updatetodo } from '../../DataLayer/ToDoAccess'

const logger = createLogger('updatetodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getuserId(event)

  const resultupdate = await updatetodo(updatedTodo, todoId, userId)
  
  var statusCode = 201
  if (!resultupdate) {
    logger.error("Unable to update ToDos")
    statusCode = 404
} else {
    logger.info("UpdateToDo succeeded:", resultupdate)
  }
      
return {
  statusCode: statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    resultupdate
  })
}
}

  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
