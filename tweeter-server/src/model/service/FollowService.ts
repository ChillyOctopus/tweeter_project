import { AuthToken, UserDto, User, FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMoreFollowersOrFollowees(token, userAlias, pageSize, lastItem, false);
  };
    
  public async loadMoreFollowers (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>  {
    return this.loadMoreFollowersOrFollowees(token, userAlias, pageSize, lastItem, true);
  };

  private async loadMoreFollowersOrFollowees (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    fetchFollowers: boolean
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos= items.map((user) => user.dto);
    return [dtos, hasMore]
  };

}