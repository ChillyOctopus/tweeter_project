"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const DynamoDaoFactory_1 = require("../../dynamo_daos/DynamoDaoFactory");
class PostService {
    factory = new DynamoDaoFactory_1.DynamoDaoFactory();
    async postStatus(authToken, status) {
        const statusDao = this.factory.getStatusDao();
        await statusDao.postToStory(authToken.alias, status);
    }
}
exports.PostService = PostService;
