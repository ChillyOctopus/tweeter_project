import { UserDto, AuthTokenDto } from "tweeter-shared";
import { AbstractUserDao } from "../abstract_daos/AbstractUserDao";
import { DynamoDbClientWrapper } from "./DynamoDbClientWrapper";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export class DynamoUserDao extends AbstractUserDao {
  private readonly db = new DynamoDbClientWrapper();

  private readonly userTable = "users";
  private readonly authTable = "auth_tokens";

  // ---------- Login ----------
  public async login(username: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    const raw = await this.db.get(this.userTable, { alias: username });
    if (!raw) throw new Error("Invalid username");

    const valid = await bcrypt.compare(password, raw.passwordHash);
    if (!valid) throw new Error("Invalid password");

    const user = new UserDto(raw.firstName, raw.lastName, raw.alias, raw.imageUrl);

    const token = await this.createAuthToken(username);
    return [user, token];
  }

  // ---------- Register ----------
  public async register(user: UserDto, password: string): Promise<[UserDto, AuthTokenDto]> {
    const existing = await this.db.get(this.userTable, { alias: user.alias });
    if (existing) throw new Error("Alias already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    await this.db.put(this.userTable, {
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      passwordHash: passwordHash,
      followerCount: 0,
      followeeCount: 0
    });

    const token = await this.createAuthToken(user.alias);
    return [user, token];
  }

  // ---------- Logout ----------
  public async logout(auth: AuthTokenDto): Promise<boolean> {
    await this.db.delete(this.authTable, { token: auth.token });
    return true;
  }

  // ---------- find user ----------
  public async findUserByAlias(alias: string): Promise<UserDto | null> {
    const raw = await this.db.get(this.userTable, { alias });
    if (!raw) return null;

    return new UserDto(raw.firstName, raw.lastName, raw.alias, raw.imageUrl);
  }

  // ---------- follow/unfollow + counts ----------
  public async findIsFollowerStatus(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const item = await this.db.get("follow", {
      follower_alias: followerAlias,
      followee_alias: followeeAlias
    });

    return item != null;
  }

  public async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.db.put("follow", {
      follower_alias: followerAlias,
      followee_alias: followeeAlias
    });

    await this.incrementFollowerCount(followeeAlias, +1);
    await this.incrementFolloweeCount(followerAlias, +1);
  }

  public async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.db.delete("follow", {
      follower_alias: followerAlias,
      followee_alias: followeeAlias
    });

    await this.incrementFollowerCount(followeeAlias, -1);
    await this.incrementFolloweeCount(followerAlias, -1);
  }

  public async getFollowerCount(alias: string): Promise<number> {
    const raw = await this.db.get(this.userTable, { alias });
    return raw ? raw.followerCount : 0;
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    const raw = await this.db.get(this.userTable, { alias });
    return raw ? raw.followeeCount : 0;
  }

  // ---------- Private helpers ----------
  private async incrementFollowerCount(alias: string, delta: number): Promise<void> {
    await this.db.update(
      this.userTable,
      { alias },
      "SET followerCount = followerCount + :d",
      { ":d": delta }
    );
  }

  private async incrementFolloweeCount(alias: string, delta: number): Promise<void> {
    await this.db.update(
      this.userTable,
      { alias },
      "SET followeeCount = followeeCount + :d",
      { ":d": delta }
    );
  }

  private async createAuthToken(alias: string): Promise<AuthTokenDto> {
    const tokenValue = uuidv4();
    const timestamp = Date.now();

    await this.db.put(this.authTable, {
      token: tokenValue,
      alias,
      timestamp
    });

    return new AuthTokenDto(tokenValue, timestamp);
  }
}
