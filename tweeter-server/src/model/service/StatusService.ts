import { StatusDto, AuthTokenDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class StatusService {
  private factory = new DynamoDaoFactory();

  public async loadMoreFeed(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMore(authToken, userAlias, pageSize, lastItem, false);
  }

  public async loadMoreStory(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMore(authToken, userAlias, pageSize, lastItem, true);
  }

  private async loadMore(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
    fetchStory: boolean
  ): Promise<[StatusDto[], boolean]> {
    const statusDao = this.factory.getStatusDao();
    return fetchStory ? await statusDao.getStory(userAlias, pageSize, lastItem) : await statusDao.getFeed(userAlias, pageSize, lastItem);
  }
}
