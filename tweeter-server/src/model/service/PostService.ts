import { AuthTokenDto, StatusDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class PostService {
  private factory = new DynamoDaoFactory();
  
  async postStatus(authToken: AuthTokenDto, status: StatusDto): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
