import { AuthToken, Status } from "tweeter-shared";

export class PostService {
  async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    // Simulate delay for UX; replace with API call later
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // TODO: Replace with actual server request, e.g.:
    // await apiClient.post("/status", { authToken, status });
  }
}
