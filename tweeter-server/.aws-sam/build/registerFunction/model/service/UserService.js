"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const DynamoDaoFactory_1 = require("../../dynamo_daos/DynamoDaoFactory");
class UserService {
    factory = new DynamoDaoFactory_1.DynamoDaoFactory();
    async getUser(token, alias) {
        await this.verifyToken(token);
        const authDao = this.factory.getAuthDao();
        return authDao.getUser(alias);
    }
    async getIsFollowerStatus(token, requester, target) {
        await this.verifyToken(token);
        const followDao = this.factory.getFollowDao();
        const record = await followDao.isFollower(requester.alias, target.alias);
        return record !== null ? record : false;
    }
    async getFollowerCount(token, user) {
        await this.verifyToken(token);
        const authDao = this.factory.getAuthDao();
        const raw = await authDao.getUser(user.alias);
        return raw?.followerCount ?? 0;
    }
    async getFolloweeCount(token, user) {
        await this.verifyToken(token);
        const authDao = this.factory.getAuthDao();
        const raw = await authDao.getUser(user.alias);
        return raw?.followeeCount ?? 0;
    }
    async follow(token, userToFollow) {
        await this.verifyToken(token);
        const followerAlias = token.alias;
        const followDao = this.factory.getFollowDao();
        const authDao = this.factory.getAuthDao();
        await followDao.follow(followerAlias, userToFollow.alias);
        await authDao.increment_counts(followerAlias, "followeeCount", +1);
        await authDao.increment_counts(userToFollow.alias, "followerCount", +1);
    }
    async unfollow(token, userToUnfollow) {
        await this.verifyToken(token);
        const followerAlias = token.alias;
        const followDao = this.factory.getFollowDao();
        const authDao = this.factory.getAuthDao();
        await followDao.unfollow(followerAlias, userToUnfollow.alias);
        await authDao.increment_counts(followerAlias, "followeeCount", -1);
        await authDao.increment_counts(userToUnfollow.alias, "followerCount", -1);
    }
    async refreshCounts(token, user) {
        await this.verifyToken(token);
        const followerCount = await this.getFollowerCount(token, user);
        const followeeCount = await this.getFolloweeCount(token, user);
        return [followerCount, followeeCount];
    }
    async verifyToken(token) {
        const authDao = this.factory.getAuthDao();
        const valid = await authDao.validateAuthToken(token);
        if (!valid)
            throw new Error("Invalid or expired auth token");
    }
}
exports.UserService = UserService;
