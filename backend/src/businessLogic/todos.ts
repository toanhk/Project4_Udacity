import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';
import { TodoDelete } from '../models/TodoDelete';
import { createLogger } from '../utils/logger'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('Todos.ts')

const todoAccess = new TodoAccess()

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function getAllTodoItems(userId: string): Promise<TodoItem[]> {
  logger.info('GetAllTodoItems.')
  return await todoAccess.getAllTodoItems(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  logger.info('Create function.')

  const todoId = uuid.v4()

  return await todoAccess.createTodoItem({
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  })
}

export async function updateTodoItem(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  userId: string
): Promise<TodoUpdate> {

  logger.info('In function: updateTodoItem()')

  return await todoAccess.updateTodoItem({
    todoId: todoId,
    userId: userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodoItem(
  userId: string,
  todoId: string
): Promise<TodoDelete> {

  logger.info('Hello! from deleteTodoItem function')
  return await todoAccess.deleteTodo({
    userId: userId,
    todoId: todoId
  })
}

export async function getUploadUrl(todoId: string) {

  logger.info('Function getUploadUrl', todoId)
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}