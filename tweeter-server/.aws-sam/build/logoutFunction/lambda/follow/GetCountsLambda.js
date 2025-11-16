"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const followees = await userService.getFolloweeCount(request.token, request.user);
    const followers = await userService.getFollowerCount(request.token, request.user);
    return {
        success: true,
        message: null,
        followees: followees,
        followers: followers
    };
};
exports.handler = handler;
