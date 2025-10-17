import { AuthToken, Status, User } from "tweeter-shared";
import { PostService } from "../model.service/PostService";
import { MessageView, Presenter } from "./Presenter";

interface PostStatusView extends MessageView{
  setIsLoading: (loading: boolean) => void;
  setPost: (text: string) => void;
  getAuthToken: () => AuthToken;
  getCurrentUser: () => User;
}

export class PostStatusPresenter extends Presenter<PostStatusView>{
    private postService: PostService;

    constructor(view: PostStatusView) {
        super(view)
        this.postService = new PostService();
    }

    async submitPost(post: string): Promise<void> {
        let toastId = "";
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            toastId = this.view.displayInfoMessage("Posting status...", 0);
            const newStatus = new Status(post, this.view.getCurrentUser(), Date.now());
            await this.postService.postStatus(this.view.getAuthToken(), newStatus);
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status", toastId);
    }
    
    protected doFinallyOperations(id?: string): void {
        if (id != null) this.view.deleteMessage(id);
        this.view.setIsLoading(false);
    }
}
