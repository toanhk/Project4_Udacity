import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo.ts')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', event);

    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const userId = getUserId(event);

    const newItem = await createTodo(newTodo, userId)
    logger.info('New Todo Item', event);
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: { ...newItem }
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

