import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { UsersTable } from "../../dynamo_daos/DynamoConstants";

export class AuthService {
  private factory = new DynamoDaoFactory();

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const authDao = this.factory.getAuthDao();
    const s3Dao = this.factory.getS3Dao();

    const existing = await authDao.getUserDtoByAlias(alias);
    if (existing) throw new Error("Alias already exists");

    const fileName = `${alias}.${imageFileExtension}`;
    const base64 = Buffer.from(imageBytes).toString("base64");
    const imageUrl = await s3Dao.putImage(fileName, base64);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new UserDto(firstName, lastName, alias, imageUrl);
    await authDao.createUserRecord(user, passwordHash);

    const token = await this.createAuthToken(alias);
    return [user, token];
  }

  async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    const authDao = this.factory.getAuthDao();

    const raw = await authDao.getUserRaw(alias);
    if (!raw) throw new Error("Invalid username");

    const valid = await bcrypt.compare(password, raw[UsersTable.ATTR_PASSWORD_HASH]);
    if (!valid) throw new Error("Invalid password");

    const user = new UserDto(raw[UsersTable.ATTR_FIRST_NAME], raw[UsersTable.ATTR_LAST_NAME], raw[UsersTable.ATTR_ALIAS], raw[UsersTable.ATTR_IMAGE_URL]);
    const token = await this.createAuthToken(alias);

    return [user, token];
  }

  async logout(auth: AuthTokenDto): Promise<void> {
    const authDao = this.factory.getAuthDao();
    const success = await authDao.deleteAuthToken(auth.token);
    if (!success) throw new Error("Logout failed");
  }

  private async createAuthToken(alias: string): Promise<AuthTokenDto> {
    const authDao = this.factory.getAuthDao();
    const tokenValue = uuidv4();
    const timestamp = Date.now();

    await authDao.storeAuthToken(tokenValue, alias, timestamp); 
    return new AuthTokenDto(tokenValue, timestamp, alias);
  }
}
