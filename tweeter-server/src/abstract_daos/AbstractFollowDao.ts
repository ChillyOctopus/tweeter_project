import { UserDto } from "tweeter-shared";

export abstract class AbstractFollowDao {
  public abstract getFollowers(
    targetAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  public abstract getFollowees(
    targetAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;
}
