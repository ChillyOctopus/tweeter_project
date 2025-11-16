"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const PostService_1 = require("../../model/service/PostService");
const handler = async (request) => {
    const postService = new PostService_1.PostService();
    await postService.postStatus(request.token, request.status);
    return {
        success: true,
        message: null
    };
};
exports.handler = handler;
