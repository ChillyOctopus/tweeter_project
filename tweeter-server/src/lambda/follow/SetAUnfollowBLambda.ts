import { UserService } from "../../model/service/UserService";
import { AToBRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: AToBRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
    await userService.unfollow(request.token, request.userAliasB);
    return {
        success: true,
        message: null
    }
}