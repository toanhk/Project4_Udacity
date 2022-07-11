import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUploadUrl } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl.ts')

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        logger.info('Going to event: ', event)
        
        const todoId = event.pathParameters.todoId

        const uploadUrl = await getUploadUrl(todoId)
        logger.info('Generated URL: ', uploadUrl)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                uploadUrl
            })
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
