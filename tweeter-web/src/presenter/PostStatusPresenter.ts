import { AuthToken, Status, User } from "tweeter-shared";
import { PostService } from "../model.service/PostService";

interface PostStatusPresenterDeps {
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  setPost: (text: string) => void;
  getAuthToken: () => AuthToken;
  getCurrentUser: () => User;
}

export class PostStatusPresenter {
  private deps: PostStatusPresenterDeps;
  private postService: PostService;

  constructor(deps: PostStatusPresenterDeps) {
    this.deps = deps;
    this.postService = new PostService();
  }

  async submitPost(post: string): Promise<void> {
    let toastId = "";
    const { deps } = this;
    try {
      deps.setIsLoading(true);
      toastId = deps.displayInfoMessage("Posting status...", 0);

      const newStatus = new Status(post, deps.getCurrentUser(), Date.now());
      await this.postService.postStatus(deps.getAuthToken(), newStatus);

      deps.setPost("");
      deps.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      deps.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      deps.deleteMessage(toastId);
      deps.setIsLoading(false);
    }
  }
}
