import { UserService } from "../../model/service/UserService";
import { GetCountsRequest, GetCountsResponse } from "tweeter-shared";

export const handler = async (request: GetCountsRequest): Promise<GetCountsResponse> => {
    const userService = new UserService();
    const followees = await userService.getFolloweeCount(request.token, request.userAlias);
    const followers = await userService.getFollowerCount(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        followees: followees,
        followers: followers
    }
}