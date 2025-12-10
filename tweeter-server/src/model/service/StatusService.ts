import { StatusDto, AuthTokenDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { PostQueue } from "../../dynamo_daos/DynamoConstants"

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
    // 1. validate token and renew
    this.validateAuth(authToken);

    // 2. validate input
    if (!statusDto.post || statusDto.post.trim().length === 0) {
      throw new Error("Post cannot be empty.");
    }

    const storyDao = this.factory.getStatusDao();

    // 3. write to story table
    await storyDao.postToStory(statusDto.user.alias, statusDto);

    // 4. create SQS client once (better moved to constructor)
    const sqs = new SQSClient({});

    // 5. send full status object, not a partial rebuild
    const messageBody = {
      authorAlias: statusDto.user.alias,
      status: statusDto // pass through exactly
    };

    // 6. send message
    await sqs.send(new SendMessageCommand({
      QueueUrl: PostQueue.URL,
      MessageBody: JSON.stringify(messageBody)
    }));
  }


  private validateAuth(authToken: AuthTokenDto): void {
    const userDao = this.factory.getAuthDao();
    const isValid = userDao.validateAuthToken(authToken);
    if (!isValid) {
      throw new Error("Invalid or expired auth token.");
    }
  }
}