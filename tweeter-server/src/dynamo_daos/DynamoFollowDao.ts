import { UserDto } from "tweeter-shared";
import { AbstractFollowDao } from "../abstract_daos/AbstractFollowDao";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";

const FOLLOW_TABLE = process.env.FOLLOW_TABLE!;
const FOLLOWEES_INDEX = "FolloweesIndex"; // follower → followee

export class DynamoFollowDao extends AbstractFollowDao {
  private readonly db = new DynamoDbClientWrapper();

  public async getFollowers(
    targetAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const query = {
      TableName: FOLLOW_TABLE,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "followee" },
      ExpressionAttributeValues: { ":pk": targetAlias },
      Limit: pageSize,
      ExclusiveStartKey: lastItem ? { followee: targetAlias, follower: lastItem.alias } : undefined,
    };

    const out = await this.db.query(query);
    const users: UserDto[] = out.Items?.map(i => ({ alias: i.follower })) ?? [];
    return [users, !!out.LastEvaluatedKey];
  }

  public async getFollowees(
    targetAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const query = {
      TableName: FOLLOW_TABLE,
      IndexName: FOLLOWEES_INDEX,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "follower" },
      ExpressionAttributeValues: { ":pk": targetAlias },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { follower: targetAlias, followee: lastItem.alias }
        : undefined,
    };

    const out = await this.db.query(query);
    const users: UserDto[] = out.Items?.map(i => ({ alias: i.followee })) ?? [];
    return [users, !!out.LastEvaluatedKey];
  }
}
