import { AuthTokenDto, StatusDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class PostService {
  private factory = new DynamoDaoFactory();
  
  async postStatus(authToken: AuthTokenDto, status: StatusDto): Promise<void> {
    const userDao = this.factory.getAuthDao();
    const valid = await userDao.validateAuthToken(authToken);
    if (!valid) throw new Error("Invalid or expired auth token");
    const statusDao = this.factory.getStatusDao();
    await statusDao.postToStory(authToken.alias, status);
  }
}
