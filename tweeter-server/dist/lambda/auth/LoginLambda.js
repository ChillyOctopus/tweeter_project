"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthService_1 = require("../../model/service/AuthService");
const handler = async (request) => {
    const authService = new AuthService_1.AuthService();
    const [user, token] = await authService.login(request.userAlias, request.userPassword);
    return {
        success: true,
        message: null,
        user: user,
        token: token
    };
};
exports.handler = handler;
