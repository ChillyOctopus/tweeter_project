"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class AuthService {
    async register(firstName, lastName, alias, password, imageBytes, imageFileExtension) {
        return this.loginOrRegister(alias, password, false, firstName, lastName, imageBytes, imageFileExtension);
    }
    async login(alias, password) {
        return this.loginOrRegister(alias, password, true);
    }
    async loginOrRegister(alias, password, isLogin, firstName, lastName, imageBytes, imageFileExtension) {
        const userObj = tweeter_shared_1.FakeData.instance.firstUser;
        const authtokenObj = tweeter_shared_1.FakeData.instance.authToken;
        ;
        const user = userObj?.dto || null;
        if (!user)
            throw new Error("Invalid registration");
        return [user, authtokenObj.dto];
    }
    async logout(authToken) {
        await new Promise((res) => setTimeout(res, 1000));
    }
}
exports.AuthService = AuthService;
