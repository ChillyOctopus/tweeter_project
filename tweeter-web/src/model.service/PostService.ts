import { AuthToken, PostStatusRequest, Status } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class PostService {
  async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.dto,
      status: status.dto
    }
    await ServerFacade.instance.postStatus(request);
  }
}
