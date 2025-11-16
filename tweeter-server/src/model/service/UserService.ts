import { AuthToken, AuthTokenDto, FakeData, UserDto } from "tweeter-shared";

export class UserService {

    public async getUser (authToken: AuthTokenDto, alias: string): Promise<UserDto | null> {
        return FakeData.instance.findUserByAlias(alias)?.dto || null;
    };

    public async getIsFollowerStatus(authToken: AuthTokenDto, user: UserDto, selectedUser: UserDto): Promise<boolean> {
        return FakeData.instance.isFollower();
    }

    public async getFollowerCount(authToken: AuthTokenDto, user: UserDto): Promise<number> {
        return FakeData.instance.getFollowerCount(user.alias);
    }

    public async getFolloweeCount(authToken: AuthTokenDto, user: UserDto): Promise<number> {
        return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async follow(authToken: AuthTokenDto, userToFollow: UserDto): Promise<void> {
        await new Promise((f) => setTimeout(f, 2000));
    }

    public async unfollow(authToken: AuthTokenDto, userToUnfollow: UserDto): Promise<void> {
        await new Promise((f) => setTimeout(f, 2000));
    }

    public async refreshCounts(authToken: AuthTokenDto, user: UserDto): Promise<[number, number]> {
        const followerCount = await this.getFollowerCount(authToken, user);
        const followeeCount = await this.getFolloweeCount(authToken, user);
        return [followerCount, followeeCount];
    }

}