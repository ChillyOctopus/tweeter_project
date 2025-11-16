import { AuthToken, Status, FakeData, User } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeed(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.loadMoreStoryOrFeed(authToken, userAlias, pageSize, lastItem, false);
  }

  public async loadMoreStory(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.loadMoreStoryOrFeed(authToken, userAlias, pageSize, lastItem, true);
  }

  private async loadMoreStoryOrFeed(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
    fetchStory: boolean
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }
}
