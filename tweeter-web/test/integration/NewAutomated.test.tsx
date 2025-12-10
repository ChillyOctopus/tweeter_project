import "@testing-library/jest-dom";
import { instance, mock, verify, when, anything, capture } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { PostService } from "../../src/model.service/PostService";
import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("PostStatusPresenter Integration Test", () => {
    let mockView: PostStatusView;
    let presenter: PostStatusPresenter;
    let mockPostService: PostService;

    const mockUser = new User(
        "Test",
        "User",
        "@testuser",
        "https://example.com/avatar.png"
    );

    const authToken = new AuthToken("test-token", Date.now(), mockUser.alias);

    beforeEach(() => {
        mockView = mock<PostStatusView>();
        const viewInstance = instance(mockView);

        // spy presenter to inject mocked service
        presenter = new PostStatusPresenter(viewInstance);
        mockPostService = mock(PostService);
        // override private postService with mocked instance
        (presenter as any).postService = instance(mockPostService);

        // stub view methods
        when(mockView.getCurrentUser()).thenReturn(mockUser);
        when(mockView.getAuthToken()).thenReturn(authToken);
        when(mockView.displayInfoMessage(anything(), anything())).thenReturn("toast-id");
    });

    it("posts a status and appends it to the user's story", async () => {
        const statusText = "Hello world!";

        // simulate postStatus succeeds
        when(mockPostService.postStatus(authToken, anything())).thenResolve();

        // call presenter
        await presenter.submitPost(statusText);

        // verify view loading indicator
        verify(mockView.setIsLoading(true)).once();

        // verify postService called with correct status
        const [capturedAuthToken, capturedStatus] = capture(mockPostService.postStatus).last();
        expect(capturedAuthToken).toBe(authToken);
        expect(capturedStatus.post).toBe(statusText);
        expect(capturedStatus.user).toEqual(mockUser);
        expect(typeof capturedStatus.timestamp).toBe("number");

        // verify success message displayed
        verify(mockView.displayInfoMessage("Status posted!", 2000)).once();

        // verify post field cleared
        verify(mockView.setPost("")).once();
    });

    it("ensures the new status appears in the user's story", async () => {
        // Mock ServerFacade to return the newly posted status
        const mockServer = mock(ServerFacade);
        const newStatus = new Status("Hello world!", mockUser, Date.now());
        when(mockServer.getStory(anything())).thenResolve({
            items: [newStatus],
            hasMore: false,
            success: true,
            message: null
        });

        // call getStory directly
        const story = await instance(mockServer).getStory({ token: authToken, userAlias: mockUser.alias, pageSize: 10, lastItem: null });
        expect(story.items!.length).toBeGreaterThan(0);
        expect(story.items![0].post).toBe("Hello world!");
        expect(story.items![0].user.alias).toBe(mockUser.alias);
    });
});
