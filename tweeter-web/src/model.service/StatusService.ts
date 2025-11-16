import { AuthToken, Status, PagedStatusItemRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

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
    const request: PagedStatusItemRequest = {
      authToken: authToken.dto,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null
    }

    let response = (fetchStory) ? await ServerFacade.instance.getStory(request) : await ServerFacade.instance.getFeed(request);
    if (!response.items) {
      return [[], response.hasMore];
    }

    return [response.items.map(i => Status.fromDto(i)).filter((s): s is Status => s !== null), response.hasMore];
  }
}
