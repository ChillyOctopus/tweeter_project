import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null> {
        return FakeData.instance.findUserByAlias(alias);
    };

    public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
        return FakeData.instance.isFollower();
    }

    public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
        return FakeData.instance.getFollowerCount(user.alias);
    }

    public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
        return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async follow(authToken: AuthToken, userToFollow: User): Promise<void> {
        await new Promise((f) => setTimeout(f, 2000));
    }

    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<void> {
        await new Promise((f) => setTimeout(f, 2000));
    }

    public async refreshCounts(authToken: AuthToken, user: User): Promise<[number, number]> {
        const followerCount = await this.getFollowerCount(authToken, user);
        const followeeCount = await this.getFolloweeCount(authToken, user);
        return [followerCount, followeeCount];
    }

}