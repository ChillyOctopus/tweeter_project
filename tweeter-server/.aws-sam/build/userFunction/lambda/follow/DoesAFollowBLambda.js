"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const userA = await userService.getUser(request.token, request.userAliasA);
    const userB = await userService.getUser(request.token, request.userAliasB);
    if (!userA || !userB)
        return false;
    let isFollower = await userService.getIsFollowerStatus(request.token, userA, userB);
    return isFollower;
};
exports.handler = handler;
