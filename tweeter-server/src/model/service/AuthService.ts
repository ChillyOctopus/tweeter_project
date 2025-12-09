import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

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

    const existing = await authDao.findUserByAlias(alias);
    if (existing) throw new Error("Alias already exists");

    const fileName = `${alias}.${imageFileExtension}`;
    const base64 = Buffer.from(imageBytes).toString("base64");
    const imageUrl = await s3Dao.putImage(fileName, base64);

    const passwordHash = await bcryptjs.hash(password, 10);

    const user = new UserDto(firstName, lastName, alias, imageUrl);
    await authDao.createUserRecord(user, passwordHash);

    const token = await this.createAuthToken(alias);
    return [user, token];
  }

  async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    const authDao = this.factory.getAuthDao();

    const raw = await authDao.getUser(alias);
    if (!raw) throw new Error("Invalid username");

    const valid = await bcryptjs.compare(password, raw.passwordHash);
    if (!valid) throw new Error("Invalid password");

    const user = new UserDto(raw.firstName, raw.lastName, raw.alias, raw.imageUrl);
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
