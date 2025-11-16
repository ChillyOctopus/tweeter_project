
import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { PostService } from "../../model/service/PostService";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const postService = new PostService();
    await postService.postStatus(request.token, request.status);
    return {
        success: true,
        message: null
    }
}