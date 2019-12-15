import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getuserId } from '../../BusinessLogic/userauthentication'
import { ToDoExists, getUploadUrl, updateuploadurl} from '../../DataLayer/ToDoAccess'

const logger = createLogger('generateuploadurl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getuserId(event)
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const validToDoId = await ToDoExists(todoId, userId)
  logger.info("validtodoid", validToDoId)

  if (!validToDoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'ToDo does not exist'
      })
    }
  }
  const uploadUrl = getUploadUrl(todoId)
  logger.info("url", uploadUrl)
 
  const updatedurldb = await updateuploadurl(todoId, userId)
  logger.info("updatedurldb", updatedurldb)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}


 // https://winterwindsoftware.com/serverless-photo-upload-api/
 // https://github.com/BaineGames/udacity-nd9990-p5/tree/master/backend/src/lambda/http