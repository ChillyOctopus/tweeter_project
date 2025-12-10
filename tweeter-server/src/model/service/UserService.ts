import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";
import { UsersTable } from "../../dynamo_daos/DynamoConstants";

export class UserService {
  private factory = new DynamoDaoFactory();

  async getUser(token: AuthTokenDto, alias: string): Promise<UserDto | null> {
    await this.verifyToken(token);
    const authDao = this.factory.getAuthDao();
    return authDao.getUserDtoByAlias(alias);
  }

  async getIsFollowerStatus(
    token: AuthTokenDto,
    requester: UserDto,
    target: UserDto
  ): Promise<boolean> {
    await this.verifyToken(token);

    const followDao = this.factory.getFollowDao();
    const record = await followDao.isFollower(requester.alias, target.alias);
    return record !== null ? record : false;
  }

  async getFollowerCount(token: AuthTokenDto, user: UserDto): Promise<number> {
    await this.verifyToken(token);
    const authDao = this.factory.getAuthDao();
    const raw = await authDao.getUserRaw(user.alias);
    return raw[UsersTable.ATTR_FOLLOWER_COUNT] ?? 0;
  }

  async getFolloweeCount(token: AuthTokenDto, user: UserDto): Promise<number> {
    await this.verifyToken(token);
    const authDao = this.factory.getAuthDao();
    const raw = await authDao.getUserRaw(user.alias);
    return raw[UsersTable.ATTR_FOLLOWEE_COUNT] ?? 0;
  }

  async follow(token: AuthTokenDto, userToFollow: UserDto): Promise<void> {
    await this.verifyToken(token);
    const followerAlias = token.alias;

    const followDao = this.factory.getFollowDao();
    const authDao = this.factory.getAuthDao();

    await followDao.follow(followerAlias, userToFollow.alias);

    await authDao.increment_counts(
      followerAlias,
      UsersTable.ATTR_FOLLOWEE_COUNT,
      +1
    );

    await authDao.increment_counts(
      userToFollow.alias,
      UsersTable.ATTR_FOLLOWER_COUNT,
      +1
    );
  }

  async unfollow(token: AuthTokenDto, userToUnfollow: UserDto): Promise<void> {
    await this.verifyToken(token);
    const followerAlias = token.alias;

    const followDao = this.factory.getFollowDao();
    const authDao = this.factory.getAuthDao();

    await followDao.unfollow(followerAlias, userToUnfollow.alias);

    await authDao.increment_counts(
      followerAlias,
      UsersTable.ATTR_FOLLOWEE_COUNT,
      -1
    );

    await authDao.increment_counts(
      userToUnfollow.alias,
      UsersTable.ATTR_FOLLOWER_COUNT,
      -1
    );
  }

  async refreshCounts(
    token: AuthTokenDto,
    user: UserDto
  ): Promise<[number, number]> {
    await this.verifyToken(token);
    const followerCount = await this.getFollowerCount(token, user);
    const followeeCount = await this.getFolloweeCount(token, user);
    return [followerCount, followeeCount];
  }

  private async verifyToken(token: AuthTokenDto): Promise<void> {
    const authDao = this.factory.getAuthDao();
    const valid = await authDao.validateAuthToken(token);
    if (!valid) throw new Error("Invalid or expired auth token");
  }
}
