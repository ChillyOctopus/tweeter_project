import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { PostService } from "../../src/model.service/PostService";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: any;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: PostService;

    const authToken = new AuthToken("test-token", Date.now());
    const currentUser = new User("test-first", "test-last", "test-alias", "test-image-url");
    const postText = "This is a test post.";

    beforeEach(() => {
        mockPostStatusView = mock<any>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);
        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);
        mockService = mock<PostService>();
        when((postStatusPresenterSpy as any).postService).thenReturn(instance(mockService));
        when(mockPostStatusView.displayInfoMessage(anything(), anything())).thenReturn("test-toast-id");
        when(mockPostStatusView.getAuthToken()).thenReturn(authToken);
        when(mockPostStatusView.getCurrentUser()).thenReturn(currentUser);
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(postText);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(postText);
        verify(mockService.postStatus(authToken, anything())).once();
        const [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).last();
        expect(capturedAuthToken).toBe(authToken);
    });

    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
        await postStatusPresenter.submitPost(postText);
        verify(mockPostStatusView.deleteMessage("test-toast-id")).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusView.displayErrorMessage(anything())).never();
    });

    it("tells the view to clear the info message and display an error message but not clear the post or display a status posted message when unsuccessful", async () => {
        const error = new Error("Failed to post.");
        when(mockService.postStatus(anything(), anything())).thenThrow(error);
        await postStatusPresenter.submitPost(postText);
        verify(mockPostStatusView.displayErrorMessage(`Failed to post the status because of exception: ${error}`)).once();
        verify(mockPostStatusView.setPost("")).never();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
    });
});
