import { StatusDto } from "tweeter-shared";

export abstract class AbstractStatusDao {
  public abstract getStory(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  public abstract getFeed(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  public abstract postStatus(status: StatusDto): Promise<void>;
}
