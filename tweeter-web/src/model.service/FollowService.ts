import { AuthToken, User} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
  public async loadMoreFollowees (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.loadMoreFollowersOrFollowees(authToken, userAlias, pageSize, lastItem, false);
  };
    
  public async loadMoreFollowers (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]>  {
    return this.loadMoreFollowersOrFollowees(authToken, userAlias, pageSize, lastItem, true);
  };

  private async loadMoreFollowersOrFollowees (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
    fetchFollowers: boolean
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.dto,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };

    let response = (fetchFollowers) ? await ServerFacade.instance.getMoreFollowers(request) : await ServerFacade.instance.getMoreFollowees(request);
    if (!response.items) {
      return [[], response.hasMore];
    }

    return [response.items.map(i => User.fromDto(i)).filter((u): u is User => u !== null), response.hasMore];
  };
}