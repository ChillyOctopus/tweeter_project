import { AuthToken, User, UserRequest, AToBRequest, PagedUserItemRequest, GetCountsRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null> {
        const request: UserRequest = {
            token: {
                token: authToken.token,
                timestamp: authToken.timestamp,
                alias: authToken.alias
            },
            userAlias: alias
        };
        return ServerFacade.instance.getUser(request);
    };

    public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
        const request: AToBRequest = {
            token: authToken.dto,
            userAliasA: user.alias,
            userAliasB: selectedUser.alias
        };
        return ServerFacade.instance.getIsFollowerStatus(request);
    }

    public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
        const request: GetCountsRequest = {
            token: authToken.dto,
            user: user.dto
        };
        return ServerFacade.instance.getFollowerCount(request);
    }

    public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
        const request: GetCountsRequest = {
            token: authToken.dto,
            user: user.dto
        };
        return ServerFacade.instance.getFolloweeCount(request);
    }

    public async follow(authToken: AuthToken, userToFollow: User): Promise<void> {
        const request: AToBRequest = {
            token: authToken.dto,
            userAliasA: "",
            userAliasB: userToFollow.alias
        };
        await ServerFacade.instance.follow(request);
    }

    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<void> {
        const request: AToBRequest = {
            token: authToken.dto,
            userAliasA: "",
            userAliasB: userToUnfollow.alias
        };
        await ServerFacade.instance.unfollow(request);
    }

    public async refreshCounts(authToken: AuthToken, user: User): Promise<[number, number]> {
        const followerCount = await this.getFollowerCount(authToken, user);
        const followeeCount = await this.getFolloweeCount(authToken, user);
        return [followerCount, followeeCount];
    }
        
}