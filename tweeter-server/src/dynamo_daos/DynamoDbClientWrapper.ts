import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
} from "@aws-sdk/lib-dynamodb";
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
        Key: marshall(key, { removeUndefinedValues: true }),
      })
    );

    return response.Item ? unmarshall(response.Item) : null;
  }

  public async put(table: string, item: Record<string, any>, conditionExpression?: string, expressionNames?: Record<string, string>, expressionValues?: Record<string, any>): Promise<void> {
    await this.client.send(
      new PutItemCommand({
        TableName: table,
        Item: marshall(item, { removeUndefinedValues: true }),
        ConditionExpression: conditionExpression,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues ? marshall(expressionValues, { removeUndefinedValues: true }) : undefined,
      })
    );
  }

  public async delete(table: string, key: Record<string, any>, conditionExpression?: string): Promise<void> {
    await this.client.send(
      new DeleteItemCommand({
        TableName: table,
        Key: marshall(key, { removeUndefinedValues: true }),
        ConditionExpression: conditionExpression
      })
    );
  }

  public async update(table: string, key: Record<string, any>, updateExpression: string, expressionValues: Record<string, any>, expressionNames?: Record<string, string>, conditionExpression?: string): Promise<void> {
    await this.client.send(
      new UpdateItemCommand({
        TableName: table,
        Key: marshall(key, { removeUndefinedValues: true }),
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: marshall(expressionValues, { removeUndefinedValues: true }),
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
        ExpressionAttributeValues: marshall(params.expressionValues, { removeUndefinedValues: true }),
        Limit: params.limit,
        ExclusiveStartKey: params.exclusiveStartKey ? marshall(params.exclusiveStartKey, { removeUndefinedValues: true }) : undefined,
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
      const request: BatchWriteCommandInput = {
        RequestItems: {
          [table]: chunk.map(item => ({
            PutRequest: {
              Item: item,
            }
          }))
        }
      };

      console.log("FULL BATCH:", JSON.stringify(request, null, 2));

      try {
        const resp = await this.client.send(new BatchWriteCommand(request));
        await this.retryUnprocessedItems(resp, table);
      } catch (err) {
        console.error("BatchWrite failed:", JSON.stringify(request, null, 2));
        throw err;
      }
    }
  }

  private async retryUnprocessedItems(
    resp: BatchWriteCommandOutput,
    table: string
  ): Promise<void> {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems &&
      resp.UnprocessedItems[table] &&
      resp.UnprocessedItems[table].length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        if (delay < 1000) delay += 100;
      }

      console.log(
        `Attempt ${attempts}. Retrying ${resp.UnprocessedItems[table].length} unprocessed items.`
      );

      const retryParams: BatchWriteCommandInput = {
        RequestItems: {
          [table]: resp.UnprocessedItems[table]
        }
      };

      resp = await this.client.send(new BatchWriteCommand(retryParams));
    }
  }

}
