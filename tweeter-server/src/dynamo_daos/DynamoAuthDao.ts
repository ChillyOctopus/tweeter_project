import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";
import { AbstractAuthDao } from "../abstract_daos/AbstractAuthDao";

export class DynamoAuthDao extends AbstractAuthDao {
  private db = new DynamoDbClientWrapper();
  private readonly USERS_TABLE = process.env.USERS_TABLE!;
  private readonly TOKENS_TABLE = process.env.AUTH_TOKENS_TABLE!;

  // ---------- User ----------
  async createUserRecord(user: UserDto, passwordHash: string): Promise<void> {
    await this.db.put(this.USERS_TABLE, {
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      passwordHash,
      followerCount: 0,
      followeeCount: 0,
    });
  }

  async increment_counts(alias: string, index: string, delta: number){
    await this.db.update(this.USERS_TABLE,
      { alias },
      `ADD { index } :delta`,
      { ":delta": delta }
    );
  }

  async validateAuthToken(authToken: AuthTokenDto): Promise<boolean> {
    const tokenRecord = await this.db.get(this.TOKENS_TABLE, { token: authToken.token });
    return tokenRecord !== null;
  }

  async getUser(alias: string): Promise<any | null> {
    return this.db.get(this.USERS_TABLE, { alias });
  }

  async findUserByAlias(alias: string): Promise<UserDto | null> {
    const raw = await this.getUser(alias);
    if (!raw) return null;
    return new UserDto(raw.firstName, raw.lastName, raw.alias, raw.imageUrl);
  }

  // ---------- AuthToken ----------
  async storeAuthToken(tokenValue: string, alias: string, timestamp: number): Promise<void> {
    await this.db.put(this.TOKENS_TABLE, {
      token: tokenValue,
      alias,
      timestamp,
    });
  }

  async deleteAuthToken(tokenValue: string): Promise<boolean> {
    await this.db.delete(this.TOKENS_TABLE, { token: tokenValue });
    return true;
  }
}
