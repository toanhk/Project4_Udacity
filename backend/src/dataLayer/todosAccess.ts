import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from "../models/TodoUpdate"
import { TodoDelete } from "../models/TodoDelete"

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodoItems(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: '#userId = :i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      })
      .promise()

    return result.Items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }


  async updateTodoItem(todoItem: TodoUpdate): Promise<TodoUpdate> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: todoItem.userId,
          todoId: todoItem.todoId
        },
        UpdateExpression: 'set #nameId= :n, dueDate= :d, done= :dn',
        ExpressionAttributeNames: {
          '#nameId': 'name'
        },
        ExpressionAttributeValues: {
          ':n': todoItem.name,
          ':d': todoItem.dueDate,
          ':dn': todoItem.done
        }
      })
      .promise()
    return todoItem
  }

  async deleteTodo(todoItem: TodoDelete): Promise<TodoDelete> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: todoItem
      })
      .promise()

    return todoItem
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
