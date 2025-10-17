import { AuthToken, Status } from "tweeter-shared";

export class PostService {
  async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
