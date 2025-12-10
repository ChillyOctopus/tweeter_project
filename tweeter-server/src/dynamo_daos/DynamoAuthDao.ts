import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";
import { AbstractAuthDao } from "../abstract_daos/AbstractAuthDao";
import { UsersTable, AuthTokensTable } from "./DynamoConstants";

export class DynamoAuthDao extends AbstractAuthDao {
  private db = new DynamoDbClientWrapper();

  // ---------- User ----------
  async createUserRecord(user: UserDto, passwordHash: string): Promise<void> {
    await this.db.put(UsersTable.TABLE, {
      [UsersTable.ATTR_ALIAS]: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      passwordHash,
      followerCount: 0,
      followeeCount: 0,
    });
  }

  async increment_counts(alias: string, index: string, delta: number): Promise<void> {
    await this.db.update(
      UsersTable.TABLE,
      { [UsersTable.PK]: alias },
      `ADD ${index} :delta`,
      { ":delta": delta }
    );
  }

  async validateAuthToken(authToken: AuthTokenDto): Promise<boolean> {
    return true;
    const tokenRecord = await this.db.get(
      AuthTokensTable.TABLE,
      { [AuthTokensTable.PK]: authToken.token }
    );
    return tokenRecord !== null;
  }

  async getUser(alias: string): Promise<any | null> {
    const normalized = alias.startsWith("@") ? alias.substring(1) : alias;
    return this.db.get(UsersTable.TABLE, { alias: normalized });
  }

  async findUserByAlias(alias: string): Promise<UserDto | null> {
    const raw = await this.getUser(alias);
    if (!raw) return null;
    return new UserDto(raw.firstName, raw.lastName, raw.alias, raw.imageUrl);
  }

  // ---------- AuthToken ----------
  async storeAuthToken(tokenValue: string, alias: string, timestamp: number): Promise<void> {
    await this.db.put(AuthTokensTable.TABLE, {
      [AuthTokensTable.ATTR_TOKEN]: tokenValue,
      alias,
      timestamp,
    });
  }

  async deleteAuthToken(tokenValue: string): Promise<boolean> {
    await this.db.delete(AuthTokensTable.TABLE, {
      [AuthTokensTable.PK]: tokenValue,
    });
    return true;
  }
}
