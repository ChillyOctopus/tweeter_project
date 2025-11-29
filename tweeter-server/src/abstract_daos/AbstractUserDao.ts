import { AuthTokenDto, UserDto } from "tweeter-shared";

export abstract class AbstractUserDao {
  public abstract login(username: string, password: string): Promise<[UserDto, AuthTokenDto]>;
  public abstract register(user: UserDto, password: string): Promise<[UserDto, AuthTokenDto]>;
  public abstract logout(authToken: AuthTokenDto): Promise<boolean>;
  public abstract findUserByAlias(alias: string): Promise<UserDto | null>;
  public abstract findIsFollowerStatus(followerAlias: string, followeeAlias: string): Promise<boolean>;
  public abstract getFollowerCount(alias: string): Promise<number>;
  public abstract getFolloweeCount(alias: string): Promise<number>;
  public abstract follow(followerAlias: string, followeeAlias: string): Promise<void>;
  public abstract unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
}
