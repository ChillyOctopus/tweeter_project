import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { AbstractFollowDao } from "../abstract_daos/AbstractFollowDao";
import { UserDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";

export class DynamoFollowDao extends AbstractFollowDao {
  private db = new DynamoDbClientWrapper();
  private readonly TABLE = "TweeterFollows";

  // Follows table modeling:
  // PK: FOLLOWEE#<alias>, SK: FOLLOWER#<alias>   — for follower lookup & follower counts
  // PK: FOLLOWER#<alias>, SK: FOLLOWEE#<alias>   — for followee lookup & followee counts

  async follow(follower: string, followee: string): Promise<void> {
    // Put into table
    await this.db.put(this.TABLE, { follower_alias: follower, followee_alias: followee });
    // TODO: Increment follower/followee counts in users table (atomic or via UserDao)
  }

  async unfollow(follower: string, followee: string): Promise<void> {
    await this.db.delete(this.TABLE, { follower_alias: follower, followee_alias: followee });
    // TODO: Decrement counts
  }

  async getAllFollowers(alias: string): Promise<string[]> {
    const res = await this.db.query({
      table: this.TABLE,
      index: "FolloweesIndex",
      keyConditionExpression: "followee_alias = :a",
      expressionValues: { ":a": alias },
    })
    return res.items.map((i: { follower_alias: any; }) => i.follower_alias);
  }

  async isFollower(follower: string, followee: string): Promise<boolean> {
    // Query GSI FolloweesIndex: PK followee_alias = followee, SK follower_alias = follower
    const res = await this.db.query({
      table: this.TABLE,
      index: "FolloweesIndex",
      keyConditionExpression: "followee_alias = :f AND follower_alias = :u",
      expressionValues: { ":f": followee, ":u": follower },
    });
    return res.items.length > 0;
  }

  async getFollowerCount(alias: string): Promise<number> {
    const res = await this.db.query({
      table: this.TABLE,
      index: "FolloweesIndex",
      keyConditionExpression: "followee_alias = :a",
      expressionValues: { ":a": alias },
    });
    return res.items.length;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const res = await this.db.query({
      table: this.TABLE,
      keyConditionExpression: "follower_alias = :a",
      expressionValues: { ":a": alias },
    });
    return res.items.length;
  }

  async getFollowers(alias: string, lastItem: UserDto | null): Promise<{items: UserDto[], hasMore: boolean}> {
    const res = await this.db.query({
      table: this.TABLE,
      index: "FolloweesIndex",
      keyConditionExpression: "followee_alias = :a",
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem ? { followee_alias: alias, follower_alias: lastItem.alias } : undefined,
    });
    return {
      items: res.items.map((i: { follower_alias: string; }) => new UserDto("", "", i.follower_alias, "")),
      hasMore: res.lastKey,
    };
  }

  async getFollowees(alias: string, lastItem: UserDto | null): Promise<{items: UserDto[], hasMore: boolean}> {
    const res = await this.db.query({
      table: this.TABLE,
      keyConditionExpression: "follower_alias = :a",
      expressionValues: { ":a": alias },
      limit: 25,
      exclusiveStartKey: lastItem ? { follower_alias: alias, followee_alias: lastItem.alias } : undefined,
    });
    return {
      items: res.items.map((i: { followee_alias: string; }) => new UserDto("", "", i.followee_alias, "")),
      hasMore: res.lastKey,
    };
  }
}
