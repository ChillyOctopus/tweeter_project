"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthService_1 = require("../../model/service/AuthService");
const handler = async (request) => {
    const authService = new AuthService_1.AuthService();
    await authService.logout(request.token);
    return {
        success: true,
        message: null
    };
};
exports.handler = handler;
