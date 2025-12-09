"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const DynamoDaoFactory_1 = require("../../dynamo_daos/DynamoDaoFactory");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
class AuthService {
    factory = new DynamoDaoFactory_1.DynamoDaoFactory();
    async register(firstName, lastName, alias, password, imageBytes, imageFileExtension) {
        const authDao = this.factory.getAuthDao();
        const s3Dao = this.factory.getS3Dao();
        const existing = await authDao.findUserByAlias(alias);
        if (existing)
            throw new Error("Alias already exists");
        const fileName = `${alias}.${imageFileExtension}`;
        const base64 = Buffer.from(imageBytes).toString("base64");
        const imageUrl = await s3Dao.putImage(fileName, base64);
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = new tweeter_shared_1.UserDto(firstName, lastName, alias, imageUrl);
        await authDao.createUserRecord(user, passwordHash);
        const token = await this.createAuthToken(alias);
        return [user, token];
    }
    async login(alias, password) {
        const authDao = this.factory.getAuthDao();
        const raw = await authDao.getUser(alias);
        if (!raw)
            throw new Error("Invalid username");
        const valid = await bcryptjs_1.default.compare(password, raw.passwordHash);
        if (!valid)
            throw new Error("Invalid password");
        const user = new tweeter_shared_1.UserDto(raw.firstName, raw.lastName, raw.alias, raw.imageUrl);
        const token = await this.createAuthToken(alias);
        return [user, token];
    }
    async logout(auth) {
        const authDao = this.factory.getAuthDao();
        const success = await authDao.deleteAuthToken(auth.token);
        if (!success)
            throw new Error("Logout failed");
    }
    async createAuthToken(alias) {
        const authDao = this.factory.getAuthDao();
        const tokenValue = (0, uuid_1.v4)();
        const timestamp = Date.now();
        await authDao.storeAuthToken(tokenValue, alias, timestamp);
        return new tweeter_shared_1.AuthTokenDto(tokenValue, timestamp, alias);
    }
}
exports.AuthService = AuthService;
