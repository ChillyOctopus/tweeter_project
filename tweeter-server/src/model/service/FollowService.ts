import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class FollowService {
  private factory = new DynamoDaoFactory();

  async loadMoreFollowees(
    token: AuthTokenDto,
    userAlias: string,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.verifyToken(token);
    return this.query(userAlias, lastItem, false);
  }

  async loadMoreFollowers(
    token: AuthTokenDto,
    userAlias: string,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.verifyToken(token);
    return this.query(userAlias, lastItem, true);
  }

  private async query(
    userAlias: string,
    lastItem: UserDto | null,
    fetchFollowers: boolean
  ): Promise<[UserDto[], boolean]> {
    const followDao = this.factory.getFollowDao();
    const authDao = this.factory.getAuthDao();
    const results = fetchFollowers ? await followDao.getFollowers(userAlias, lastItem) : await followDao.getFollowees(userAlias, lastItem);
    for (let i = 0; i < results.items.length; i++) {
      results.items[i] = await authDao.getUserDtoByAlias(results.items[i]);
    }
    return [results.items, results.hasMore]
  }

  private async verifyToken(token: AuthTokenDto): Promise<void> {
    const userDao = this.factory.getAuthDao();
    const valid = await userDao.validateAuthToken(token);
    if (!valid) throw new Error("Invalid or expired auth token");
  }
}
