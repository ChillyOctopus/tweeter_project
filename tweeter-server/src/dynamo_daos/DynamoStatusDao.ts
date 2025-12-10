import { AbstractStatusDao } from "../abstract_daos/AbstractStatusDao";
import { StatusDto, UserDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";
import { StoryTable, FeedTable } from "./DynamoConstants";

export class DynamoStatusDao extends AbstractStatusDao {
  private db = new DynamoDbClientWrapper();

  async postToStory(authorAlias: string, status: StatusDto): Promise<void> {
    await this.db.put(StoryTable.TABLE, {
      [StoryTable.PK]: authorAlias,
      [StoryTable.SK]: status.timestamp,
      [StoryTable.ATTR_POST]: status.post,
      [StoryTable.ATTR_USER_OBJECT]: JSON.stringify(status.user),
    });
  }

  async postToFeedBatch(followerAliases: string[], status: StatusDto): Promise<void> {
    const items = followerAliases.map(alias => ({
      [FeedTable.PK]: alias,
      [FeedTable.SK]: status.timestamp,
      [FeedTable.ATTR_USER_OBJECT]: JSON.stringify(status.user),
    }));
    await this.db.batchWrite(FeedTable.TABLE, items);
  }

  async getStory(userAlias: string, lastItem: StatusDto | null) {
    const { items, lastKey } = await this.db.query({
      table: StoryTable.TABLE,
      keyConditionExpression: `${StoryTable.PK} = :a`,
      expressionValues: { ":a": userAlias },
      limit: 25,
      exclusiveStartKey: lastItem
        ? { [StoryTable.PK]: userAlias, [StoryTable.SK]: lastItem.timestamp }
        : undefined,
      scanForward: false,
    });

    return {
      items: items.map(i => new StatusDto(i.post, JSON.parse(i.userObject), i.timestamp)),
      hasMore: !!lastKey,
    };
  }

  async getFeed(userAlias: string, lastItem: StatusDto | null) {
    const { items, lastKey } = await this.db.query({
      table: FeedTable.TABLE,
      keyConditionExpression: `${FeedTable.PK} = :a`,
      expressionValues: { ":a": userAlias },
      limit: 25,
      exclusiveStartKey: lastItem
        ? { [FeedTable.PK]: userAlias, [FeedTable.SK]: lastItem.timestamp }
        : undefined,
      scanForward: false,
    });

    return {
      items: items.map(i => new StatusDto(i.post, JSON.parse(i.userObject), i.timestamp)),
      hasMore: !!lastKey,
    };
  }
}
