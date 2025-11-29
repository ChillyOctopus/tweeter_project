import { UserDto, AuthTokenDto } from "tweeter-shared";
import { AbstractUserDao } from "../abstract_daos/AbstractUserDao";

export class DynamoUserDao extends AbstractUserDao {
  public login(username: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    throw new Error("Method not implemented.");
  }
  public register(user: UserDto, password: string): Promise<[UserDto, AuthTokenDto]> {
    throw new Error("Method not implemented.");
  }
  public logout(authToken: AuthTokenDto): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public findUserByAlias(alias: string): Promise<UserDto | null> {
    throw new Error("Method not implemented.");
  }
  public findIsFollowerStatus(followerAlias: string, followeeAlias: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public getFollowerCount(alias: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public getFolloweeCount(alias: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public follow(followerAlias: string, followeeAlias: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}