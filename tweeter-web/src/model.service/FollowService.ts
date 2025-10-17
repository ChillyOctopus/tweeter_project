import { AuthToken, User, FakeData } from "tweeter-shared";

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
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    };
}