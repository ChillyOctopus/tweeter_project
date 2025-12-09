import { AbstractStatusDao } from "../abstract_daos/AbstractStatusDao";
import { StatusDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";
import { StoryTable, FeedTable } from "./DynamoConstants";

export class DynamoStatusDao extends AbstractStatusDao {
  private db = new DynamoDbClientWrapper();

  async postToStory(authorAlias: string, status: StatusDto): Promise<void> {
    await this.db.put(StoryTable.TABLE, {
      [StoryTable.ATTR_ALIAS]: authorAlias,
      [StoryTable.ATTR_TIMESTAMP]: status.timestamp,
      post: status.post,
    });
  }

  async postToFeedBatch(followerAliases: string[], status: StatusDto): Promise<void> {
    const items = followerAliases.map(alias => ({
      [FeedTable.ATTR_ALIAS]: alias,
      [FeedTable.ATTR_TIMESTAMP]: status.timestamp,
      post: status.post,
    }));
    await this.db.batchWrite(FeedTable.TABLE, items);
  }

  async getStory(alias: string, lastItem: StatusDto | null) {
    const { items, lastKey } = await this.db.query({
      table: StoryTable.TABLE,
      keyConditionExpression: `${StoryTable.PK} = :a`,
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem
        ? { [StoryTable.PK]: alias, [StoryTable.SK]: lastItem.timestamp }
        : undefined,
      scanForward: false,
    });

    return {
      items: items.map(i => new StatusDto(i.alias, i.post, i.timestamp)),
      hasMore: !!lastKey,
    };
  }

  async getFeed(alias: string, lastItem: StatusDto | null) {
    const { items, lastKey } = await this.db.query({
      table: FeedTable.TABLE,
      keyConditionExpression: `${FeedTable.PK} = :a`,
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem
        ? { [FeedTable.PK]: alias, [FeedTable.SK]: lastItem.timestamp }
        : undefined,
      scanForward: false,
    });

    return {
      items: items.map(i => new StatusDto(i.alias, i.post, i.timestamp)),
      hasMore: !!lastKey,
    };
  }
}
