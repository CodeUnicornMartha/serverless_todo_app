import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getuserId } from '../../BusinessLogic/userauthentication'
import { ToDoExists, getUploadUrl, updateuploadurl, uploadimage, seeImage} from '../../DataLayer/ToDoAccess'

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
  const updatedurldb = updateuploadurl(todoId, userId, uploadUrl)
  logger.info("updatedurldb", updatedurldb)
  const imageurl = await uploadimage(todoId, userId, event)
  logger.info("image", imageurl)
  const attachmentUrl = seeImage(todoId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl,
      attachmentUrl: attachmentUrl,
      imageurl: imageurl

    })
  }
}


 // https://winterwindsoftware.com/serverless-photo-upload-api/
 // https://github.com/BaineGames/udacity-nd9990-p5/tree/master/backend/src/lambda/http