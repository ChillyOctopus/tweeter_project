import { AuthTokenDto, UserDto } from "tweeter-shared";

export abstract class AbstractUserDao {
  public abstract login(): [UserDto, AuthTokenDto]
  public abstract register(): [UserDto, AuthTokenDto]
  public abstract logout(): boolean
}