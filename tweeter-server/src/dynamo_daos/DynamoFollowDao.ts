import { AbstractFollowDao } from "../abstract_daos/AbstractFollowDao";
import { UserDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";
import { FollowsTable } from "./DynamoConstants";

export class DynamoFollowDao extends AbstractFollowDao {
  private db = new DynamoDbClientWrapper();

  async follow(follower: string, followee: string): Promise<void> {
    await this.db.put(FollowsTable.TABLE, {
      [FollowsTable.ATTR_FOLLOWER_ALIAS]: follower,
      [FollowsTable.ATTR_FOLLOWEE_ALIAS]: followee,
    });
  }

  async unfollow(follower: string, followee: string): Promise<void> {
    await this.db.delete(FollowsTable.TABLE, {
      [FollowsTable.PK]: follower,
      [FollowsTable.SK]: followee,
    });
  }

  async isFollower(follower: string, followee: string): Promise<boolean> {
    const res = await this.db.query({
      table: FollowsTable.TABLE,
      index: FollowsTable.GSI_FOLLOWEES,
      keyConditionExpression:
        `${FollowsTable.GSI_FOLLOWEES_PK} = :f AND ${FollowsTable.GSI_FOLLOWEES_SK} = :u`,
      expressionValues: { ":f": followee, ":u": follower },
    });

    return res.items.length > 0;
  }

  async getFollowerCount(alias: string): Promise<number> {
    const res = await this.db.query({
      table: FollowsTable.TABLE,
      index: FollowsTable.GSI_FOLLOWEES,
      keyConditionExpression: `${FollowsTable.GSI_FOLLOWEES_PK} = :a`,
      expressionValues: { ":a": alias },
    });
    return res.items.length;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const res = await this.db.query({
      table: FollowsTable.TABLE,
      keyConditionExpression: `${FollowsTable.PK} = :a`,
      expressionValues: { ":a": alias },
    });
    return res.items.length;
  }

  async getFollowers(alias: string, lastItem: UserDto | null) {
    const res = await this.db.query({
      table: FollowsTable.TABLE,
      index: FollowsTable.GSI_FOLLOWEES,
      keyConditionExpression: `${FollowsTable.GSI_FOLLOWEES_PK} = :a`,
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem
        ? {
            [FollowsTable.GSI_FOLLOWEES_PK]: alias,
            [FollowsTable.GSI_FOLLOWEES_SK]: lastItem.alias,
          }
        : undefined,
    });

    return {
      items: res.items.map(item => item[FollowsTable.ATTR_FOLLOWER_ALIAS]),
      hasMore: !!res.lastKey,
    };
  }

  async getFollowees(alias: string, lastItem: UserDto | null) {
    const res = await this.db.query({
      table: FollowsTable.TABLE,
      keyConditionExpression: `${FollowsTable.PK} = :a`,
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem
        ? {
            [FollowsTable.PK]: alias,
            [FollowsTable.SK]: lastItem.alias,
          }
        : undefined,
    });

    return {
      items: res.items.map(item => item[FollowsTable.ATTR_FOLLOWEE_ALIAS]),
      hasMore: !!res.lastKey,
    };
  }
}
