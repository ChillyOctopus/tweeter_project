import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class FollowService {
  private factory = new DynamoDaoFactory();

  public async loadMoreFollowees(
    token: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMore(token, userAlias, pageSize, lastItem, false);
  }

  public async loadMoreFollowers(
    token: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMore(token, userAlias, pageSize, lastItem, true);
  }

  private async loadMore(
    token: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    fetchFollowers: boolean
  ): Promise<[UserDto[], boolean]> {
    const followDao = this.factory.getFollowDao();
    return fetchFollowers ? await followDao.getFollowers(userAlias, pageSize, lastItem) : await followDao.getFollowees(userAlias, pageSize, lastItem);
  }
}
