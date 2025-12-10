import { StatusDto, AuthTokenDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class StatusService {
  private factory = new DynamoDaoFactory();

  public async loadMoreFeed(
    authToken: AuthTokenDto,
    userAlias: string,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.validateAuth(authToken);
    return this.loadMoreInternal(userAlias, lastItem, false);
  }

  public async loadMoreStory(
    authToken: AuthTokenDto,
    userAlias: string,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.validateAuth(authToken);
    return this.loadMoreInternal(userAlias, lastItem, true);
  }

  private async loadMoreInternal(
    userAlias: string,
    lastItem: StatusDto | null,
    isStory: boolean
  ): Promise<[StatusDto[], boolean]> {
    const statusDao = this.factory.getStatusDao();
    if (isStory) {
      const result = await statusDao.getStory(userAlias, lastItem);
      return [result.items, result.hasMore]
    } else {
      const result = await statusDao.getFeed(userAlias, lastItem);
      return [result.items, result.hasMore]
    }
  }

  public async postStatus(
    authToken: AuthTokenDto,
    statusDto: StatusDto
  ): Promise<void> {
    this.validateAuth(authToken);
    
    const statusDao = this.factory.getStatusDao();
    const followDao = this.factory.getFollowDao();
    await statusDao.postToStory(statusDto.user.alias, statusDto);

    const followees = await followDao.getAllFollowers(statusDto.user.alias);
    await statusDao.postToFeedBatch(followees, statusDto)
  }

  private validateAuth(authToken: AuthTokenDto): void {
    const userDao = this.factory.getAuthDao();
    const isValid = userDao.validateAuthToken(authToken);
    if (!isValid) {
      throw new Error("Invalid or expired auth token.");
    }
  }
}