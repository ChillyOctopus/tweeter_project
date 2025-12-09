import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class DynamoDbClientWrapper {
  private readonly client: DynamoDBClient;

  public constructor() {
    this.client = new DynamoDBClient({});
  }

  // ---------- Basic operations ----------
  public async get(table: string, key: Record<string, any>): Promise<any | null> {
    const response = await this.client.send(
      new GetItemCommand({
        TableName: table,
        Key: marshall(key),
      })
    );

    return response.Item ? unmarshall(response.Item) : null;
  }

  public async put(table: string, item: Record<string, any>, conditionExpression?: string, expressionNames?: Record<string, string>, expressionValues?: Record<string, any>): Promise<void> {
    await this.client.send(
      new PutItemCommand({
        TableName: table,
        Item: marshall(item),
        ConditionExpression: conditionExpression,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues ? marshall(expressionValues) : undefined,
      })
    );
  }

  public async delete(table: string, key: Record<string, any>, conditionExpression?: string): Promise<void> {
    await this.client.send(
      new DeleteItemCommand({
        TableName: table,
        Key: marshall(key),
        ConditionExpression: conditionExpression
      })
    );
  }

  public async update(table: string, key: Record<string, any>, updateExpression: string, expressionValues: Record<string, any>, expressionNames?: Record<string, string>, conditionExpression?: string): Promise<void> {
    await this.client.send(
      new UpdateItemCommand({
        TableName: table,
        Key: marshall(key),
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: marshall(expressionValues),
        ExpressionAttributeNames: expressionNames,
        ConditionExpression: conditionExpression,
      })
    );
  }

  // ---------- Query with pagination ----------
  public async query(
    params: {
      table: string;
      index?: string;
      keyConditionExpression: string;
      expressionValues: Record<string, any>;
      limit?: number;
      exclusiveStartKey?: Record<string, any>;
      scanForward?: boolean;
    }
  ): Promise<{ items: any[]; lastKey: any | undefined }> {
    const response = await this.client.send(
      new QueryCommand({
        TableName: params.table,
        IndexName: params.index,
        KeyConditionExpression: params.keyConditionExpression,
        ExpressionAttributeValues: marshall(params.expressionValues),
        Limit: params.limit,
        ExclusiveStartKey: params.exclusiveStartKey ? marshall(params.exclusiveStartKey) : undefined,
        ScanIndexForward: params.scanForward ?? true,
      })
    );

    const items = response.Items ? response.Items.map((i: any) => unmarshall(i)) : [];
    const lastKey = response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : undefined;

    return { items, lastKey };
  }

  // ---------- Batch write (25 max) ----------
  public async batchWrite(
    table: string,
    items: Record<string, any>[]
  ): Promise<void> {

    const chunks = [];
    for (let i = 0; i < items.length; i += 25) {
      chunks.push(items.slice(i, i + 25));
    }

    for (const chunk of chunks) {
      const requestItems = {
        [table]: chunk.map(item => ({
          PutRequest: { Item: marshall(item) }
        }))
      };

      await this.client.send(
        new BatchWriteItemCommand({ RequestItems: requestItems })
      );
    }
  }
}
