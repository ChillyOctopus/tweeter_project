import { UserService } from "../../model/service/UserService";
import { AToBRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: AToBRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
    const user = await userService.getUser(request.token, request.userAliasB);
    await userService.follow(request.token, user!);
    return {
        success: true,
        message: null
    }
}