"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const DynamoDaoFactory_1 = require("../../dynamo_daos/DynamoDaoFactory");
class FollowService {
    factory = new DynamoDaoFactory_1.DynamoDaoFactory();
    async loadMoreFollowees(token, userAlias, lastItem) {
        await this.verifyToken(token);
        return this.query(userAlias, lastItem, false);
    }
    async loadMoreFollowers(token, userAlias, lastItem) {
        await this.verifyToken(token);
        return this.query(userAlias, lastItem, true);
    }
    async query(userAlias, lastItem, fetchFollowers) {
        const followDao = this.factory.getFollowDao();
        const results = fetchFollowers ? await followDao.getFollowers(userAlias, lastItem) : await followDao.getFollowees(userAlias, lastItem);
        return [results.items, results.hasMore];
    }
    async verifyToken(token) {
        const userDao = this.factory.getAuthDao();
        const valid = await userDao.validateAuthToken(token);
        if (!valid)
            throw new Error("Invalid or expired auth token");
    }
}
exports.FollowService = FollowService;
