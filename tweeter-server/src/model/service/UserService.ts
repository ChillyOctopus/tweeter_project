import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class UserService {
    private factory = new DynamoDaoFactory();

    public async getUser(authToken: AuthTokenDto, alias: string): Promise<UserDto | null> {
        return this.factory.getUserDao().findUserByAlias(alias);
    }

    public async getIsFollowerStatus(authToken: AuthTokenDto, user: UserDto, selectedUser: UserDto): Promise<boolean> {
        return this.factory.getUserDao().findIsFollowerStatus(user.alias, selectedUser.alias);
    }

    public async getFollowerCount(authToken: AuthTokenDto, user: UserDto): Promise<number> {
        return this.factory.getUserDao().getFollowerCount(user.alias);
    }

    public async getFolloweeCount(authToken: AuthTokenDto, user: UserDto): Promise<number> {
        return this.factory.getUserDao().getFolloweeCount(user.alias);
    }

    public async follow(authToken: AuthTokenDto, userToFollow: UserDto): Promise<void> {
        // follower = the one who is logged in (given by auth token)
        // you may decode the token if needed; for now assume alias comes from DAO
        const followerAlias = authToken.alias; 
        return this.factory.getUserDao().follow(followerAlias, userToFollow.alias);
    }

    public async unfollow(authToken: AuthTokenDto, userToUnfollow: UserDto): Promise<void> {
        // follower = the one who is logged in (given by auth token)
        // you may decode the token if needed; for now assume alias comes from DAO
        const followerAlias = authToken.alias;
        return this.factory.getUserDao().unfollow(followerAlias, userToUnfollow.alias);
    }

    public async refreshCounts(authToken: AuthTokenDto, user: UserDto): Promise<[number, number]> {
        const followerCount = await this.getFollowerCount(authToken, user);
        const followeeCount = await this.getFolloweeCount(authToken, user);
        return [followerCount, followeeCount];
    }
}
