import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, when, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../../src/presenter/PostStatusPresenter";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../../src/components/userInfo/UserHooks";
import { User, AuthToken } from "tweeter-shared";

jest.mock("../../../../src/components/userInfo/UserHooks", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

jest.mock("../../../../src/presenter/PostStatusPresenter");

describe("PostStatus Component", () => {
  const mockUser = new User("First", "Last", "@alias", "imageUrl");
  const mockToken = new AuthToken("mockTokenValue", Date.now());
  const mockPresenter = mock<PostStatusPresenter>();
  const mockPresenterInstance = instance(mockPresenter);

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockToken,
    });

    (PostStatusPresenter as unknown as jest.Mock).mockImplementation(() => mockPresenterInstance);
  });

  function renderPostStatus() {
    render(<PostStatus />);
    const postButton = screen.getByRole("button", { name: /Post Status/i });
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    const textArea = screen.getByPlaceholderText("What's on your mind?");
    return { user: userEvent.setup(), postButton, clearButton, textArea };
  }

  it("starts with both Post Status and Clear buttons disabled", () => {
    const { postButton, clearButton } = renderPostStatus();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when text field has text", async () => {
    const { user, postButton, clearButton, textArea } = renderPostStatus();

    await user.type(textArea, "Test status update!");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textArea);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's submitPost method with correct parameters when Post Status button is pressed", async () => {
    const { user, postButton, textArea } = renderPostStatus();
    const testPost = "This is a test post!";

    await user.type(textArea, testPost);
    await user.click(postButton);

    verify(mockPresenter.submitPost(testPost)).once();
  });
});
