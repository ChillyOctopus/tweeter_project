"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthService_1 = require("../../model/service/AuthService");
const handler = async (event) => {
    const authService = new AuthService_1.AuthService();
    const [user, authToken] = await authService.register(event.firstName, event.lastName, event.alias, event.password, event.imageBytes, event.imageFileExtension);
    return {
        success: true,
        message: null,
        user: user,
        token: authToken,
    };
};
exports.handler = handler;
