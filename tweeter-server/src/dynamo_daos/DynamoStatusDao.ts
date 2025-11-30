import { StatusDto } from "tweeter-shared";
import { AbstractStatusDao } from "../abstract_daos/AbstractStatusDao";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";

const STORY_TABLE = process.env.STORY_TABLE!;
const FEED_TABLE = process.env.FEED_TABLE!;

export class DynamoStatusDao extends AbstractStatusDao {
  private readonly db = new DynamoDbClientWrapper();

  public async getStory(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const query = {
      TableName: STORY_TABLE,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "alias" },
      ExpressionAttributeValues: { ":pk": userAlias },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { alias: userAlias, timestamp: lastItem.timestamp }
        : undefined,
      ScanIndexForward: false, // newest first
    };

    const out = await this.db.query(query);
    const statuses = (out.Items || []) as StatusDto[];
    return [statuses, !!out.LastEvaluatedKey];
  }

  public async getFeed(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const query = {
      TableName: FEED_TABLE,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "alias" },
      ExpressionAttributeValues: { ":pk": userAlias },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { alias: userAlias, timestamp: lastItem.timestamp }
        : undefined,
      ScanIndexForward: false,
    };

    const out = await this.db.query(query);
    const statuses = (out.Items || []) as StatusDto[];
    return [statuses, !!out.LastEvaluatedKey];
  }

  public async postStatus(status: StatusDto): Promise<void> {
    // 1. Write to the story table
    await this.db.put({
      TableName: STORY_TABLE,
      Item: status,
    });

    // 2. Fan-out logic is handled at the service layer or via Lambda trigger
    // This DAO remains single-responsibility: pure operations on tables
  }
}
