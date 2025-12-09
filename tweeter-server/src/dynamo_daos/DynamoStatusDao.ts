import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { AbstractStatusDao } from "../abstract_daos/AbstractStatusDao";
import { StatusDto, UserDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";

export class DynamoStatusDao extends AbstractStatusDao {
  private db = new DynamoDbClientWrapper();
  private readonly STORY_TABLE = "TweeterStory";
  private readonly FEED_TABLE = "TweeterFeed";

  // Story modeling:
  // PK: STORY#<alias>, SK: <timestamp>
  //
  // Feed modeling:
  // PK: FEED#<followerAlias>, SK: <timestamp>
  // Written by fan-out in the service layer.

  // Posting to Story
  async postToStory(authorAlias: string, status: StatusDto): Promise<void> {
    await this.db.put(this.STORY_TABLE, {
      alias: authorAlias,
      timestamp: status.timestamp,
      post: status.post,
    });
  }

  // Posting to Feed in batch
  async postToFeedBatch(followerAliases: string[], status: StatusDto): Promise<void> {
    const items = followerAliases.map(alias => ({
      alias,
      timestamp: status.timestamp,
      post: status.post,
    }));
    await this.db.batchWrite(this.FEED_TABLE, items); // handle 25 item chunks inside wrapper
  }

  // Query Story (paginated)
  async getStory(alias: string, lastItem: StatusDto | null): Promise<{items: StatusDto[], hasMore: boolean}> {
    const { items, lastKey } = await this.db.query({
      table: this.STORY_TABLE,
      keyConditionExpression: "alias = :a",
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem ? { alias, timestamp: lastItem.timestamp } : undefined,
      scanForward: false, // descending order for latest first
    });
    return { items: items.map((i: { alias: string; content: UserDto; timestamp: number; }) => new StatusDto(i.alias, i.content, i.timestamp)), hasMore: lastKey };
  }

  // Query Feed (paginated)
  async getFeed(alias: string, lastItem: StatusDto | null): Promise<{items: StatusDto[], hasMore: boolean}> {
    const { items, lastKey } = await this.db.query({
      table: this.FEED_TABLE,
      keyConditionExpression: "alias = :a",
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem ? { alias, timestamp: lastItem.timestamp } : undefined,
      scanForward: false,
    });
    return { items: items.map((i: { alias: string; content: UserDto; timestamp: number; }) => new StatusDto(i.alias, i.content, i.timestamp)), hasMore: lastKey };
  }
}
