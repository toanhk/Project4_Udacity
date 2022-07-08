import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';
import { TodoDelete } from '../models/TodoDelete';

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const todoAccess = new TodoAccess()

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function getAllTodoItems(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getAllTodoItems(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

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

  return await todoAccess.deleteTodo({
    userId: userId,
    todoId: todoId
  })
}

export async function getUploadUrl(todoId: string) {

  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}