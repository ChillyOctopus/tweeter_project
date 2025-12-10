import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";
import { AbstractAuthDao } from "../abstract_daos/AbstractAuthDao";
import { UsersTable, AuthTokensTable, TOKEN_LIFETIME_MS } from "./DynamoConstants";

export class DynamoAuthDao extends AbstractAuthDao {
  private db = new DynamoDbClientWrapper();

  // ---------- User ----------
  async createUserRecord(user: UserDto, passwordHash: string): Promise<void> {
    await this.db.put(UsersTable.TABLE, {
      [UsersTable.ATTR_ALIAS]: user.alias,
      [UsersTable.ATTR_FIRST_NAME]: user.firstName,
      [UsersTable.ATTR_LAST_NAME]: user.lastName,
      [UsersTable.ATTR_IMAGE_URL]: user.imageUrl,
      [UsersTable.ATTR_PASSWORD_HASH]: passwordHash,
      [UsersTable.ATTR_FOLLOWER_COUNT]: 0,
      [UsersTable.ATTR_FOLLOWEE_COUNT]: 0,
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

  async getUserRaw(alias: string): Promise<any | null> {
    const normalized = alias.startsWith("@") ? alias.substring(1) : alias;
    return this.db.get(UsersTable.TABLE, { alias: normalized });
  }

  async getUserDtoByAlias(alias: string): Promise<UserDto | null> {
    const raw = await this.getUserRaw(alias);
    if (!raw) return null;
    return new UserDto(raw[UsersTable.ATTR_FIRST_NAME], raw[UsersTable.ATTR_LAST_NAME], raw[UsersTable.ATTR_ALIAS], raw[UsersTable.ATTR_IMAGE_URL]);
  }

  // ---------- AuthToken ----------
  async validateAuthToken(authToken: AuthTokenDto): Promise<boolean> {
    const tokenRecord = await this.db.get(
      AuthTokensTable.TABLE,
      { [AuthTokensTable.PK]: authToken.token }
    );

    if (!tokenRecord) return false;

    const now = Date.now();
    const lastUsed = tokenRecord[AuthTokensTable.ATTR_LAST_USED] as number;

    const isExpired = now - lastUsed > TOKEN_LIFETIME_MS;
    if (isExpired) {
      await this.deleteAuthToken(authToken.token);
      return false;
    }

    await this.refreshAuthTokenUsage(authToken.token, now);

    return true;
  }

  async storeAuthToken(tokenValue: string, alias: string, timestamp: number): Promise<void> {
    const lastUsed = timestamp;
    const expiresAt = Math.floor((timestamp + TOKEN_LIFETIME_MS) / 1000);

    await this.db.put(AuthTokensTable.TABLE, {
      [AuthTokensTable.PK]: tokenValue,
      [AuthTokensTable.ATTR_LAST_USED]: lastUsed,
      [AuthTokensTable.ATTR_EXPIRES_AT]: expiresAt
    });
  }

  async deleteAuthToken(tokenValue: string): Promise<boolean> {
    await this.db.delete(AuthTokensTable.TABLE, {
      [AuthTokensTable.PK]: tokenValue,
    });
    return true;
  }
  
  async refreshAuthTokenUsage(tokenValue: string, now: number): Promise<void> {
    const expiresAt = Math.floor((now + TOKEN_LIFETIME_MS) / 1000);

    await this.db.update(
      AuthTokensTable.TABLE,
      { [AuthTokensTable.PK]: tokenValue },
      "set lastUsed = :now, expiresAt = :ttl",
      {
        ":now": now,
        ":ttl": expiresAt
      }
    );
  }

}
