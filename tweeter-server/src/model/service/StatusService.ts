import { Status, FakeData, StatusDto, AuthTokenDto } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeed(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMoreStoryOrFeed(authToken, userAlias, pageSize, lastItem, false);
  }

  public async loadMoreStory(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMoreStoryOrFeed(authToken, userAlias, pageSize, lastItem, true);
  }

  private async loadMoreStoryOrFeed(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
    fetchStory: boolean
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const dtos= items.map((status) => status.dto);
    return [dtos, hasMore]
  }
}
