import { AuthToken, Status, FakeData, User } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeed(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with real server call
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStory(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with real server call
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }
}
