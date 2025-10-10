import "./PostStatus.css";
import { useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserHooks";
import { PostStatusPresenter } from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();
  const { currentUser, authToken } = useUserInfo();

  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presenter = new PostStatusPresenter({
    displayInfoMessage,
    displayErrorMessage,
    deleteMessage,
    setIsLoading,
    setPost,
    getAuthToken: () => authToken!,
    getCurrentUser: () => currentUser!,
  });

  const submitPost = (event: React.MouseEvent) => {
    event.preventDefault();
    presenter.submitPost(post);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const isButtonDisabled = !post.trim() || !authToken || !currentUser;

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={isButtonDisabled}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            "Post Status"
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={isButtonDisabled}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
