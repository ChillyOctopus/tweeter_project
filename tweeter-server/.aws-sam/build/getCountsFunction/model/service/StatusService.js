"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const DynamoDaoFactory_1 = require("../../dynamo_daos/DynamoDaoFactory");
class StatusService {
    factory = new DynamoDaoFactory_1.DynamoDaoFactory();
    async loadMoreFeed(authToken, userAlias, lastItem) {
        this.validateAuth(authToken);
        return this.loadMoreInternal(userAlias, lastItem, false);
    }
    async loadMoreStory(authToken, userAlias, lastItem) {
        this.validateAuth(authToken);
        return this.loadMoreInternal(userAlias, lastItem, true);
    }
    async loadMoreInternal(userAlias, lastItem, isStory) {
        const statusDao = this.factory.getStatusDao();
        if (isStory) {
            const result = await statusDao.getStory(userAlias, lastItem);
            return [result.items, result.hasMore];
        }
        else {
            const result = await statusDao.getFeed(userAlias, lastItem);
            return [result.items, result.hasMore];
        }
    }
    async postStatus(authToken, alias, content, timestamp) {
        this.validateAuth(authToken);
        const userDao = this.factory.getAuthDao();
        const statusDao = this.factory.getStatusDao();
        const followDao = this.factory.getFollowDao();
        const dtoUser = await userDao.findUserByAlias(authToken.alias);
        const dtoStatus = { post: content, user: dtoUser, timestamp: timestamp };
        await statusDao.postToStory(alias, dtoStatus);
        const followees = await followDao.getAllFollowers(alias);
        await statusDao.postToFeedBatch(followees, dtoStatus);
    }
    validateAuth(authToken) {
        const userDao = this.factory.getAuthDao();
        const isValid = userDao.validateAuthToken(authToken);
        if (!isValid) {
            throw new Error("Invalid or expired auth token.");
        }
    }
}
exports.StatusService = StatusService;
