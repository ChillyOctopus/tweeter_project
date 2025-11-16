import { AuthTokenDto, StatusDto } from "tweeter-shared";

export class PostService {
  async postStatus(authToken: AuthTokenDto, status: StatusDto): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
