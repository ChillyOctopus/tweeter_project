"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(authToken, alias) {
        return tweeter_shared_1.FakeData.instance.findUserByAlias(alias)?.dto || null;
    }
    ;
    async getIsFollowerStatus(authToken, user, selectedUser) {
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    async getFollowerCount(authToken, user) {
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    async getFolloweeCount(authToken, user) {
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    async follow(authToken, userToFollow) {
        await new Promise((f) => setTimeout(f, 2000));
    }
    async unfollow(authToken, userToUnfollow) {
        await new Promise((f) => setTimeout(f, 2000));
    }
    async refreshCounts(authToken, user) {
        const followerCount = await this.getFollowerCount(authToken, user);
        const followeeCount = await this.getFolloweeCount(authToken, user);
        return [followerCount, followeeCount];
    }
}
exports.UserService = UserService;
