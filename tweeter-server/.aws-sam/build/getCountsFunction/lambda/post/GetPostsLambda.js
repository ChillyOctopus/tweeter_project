"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    const [statusArray, hasMore] = await statusService.loadMoreFeed(request.token, request.userAlias, request.lastItem);
    return {
        success: true,
        message: null,
        items: statusArray,
        hasMore: hasMore
    };
};
exports.handler = handler;
