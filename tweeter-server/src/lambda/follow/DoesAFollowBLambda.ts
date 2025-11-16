import { UserService } from "../../model/service/UserService";
import { AToBRequest, DoesAFollowBResponse } from "tweeter-shared";

export const handler = async (request: AToBRequest): Promise<DoesAFollowBResponse> => {
    const userService = new UserService();
    const userA = await userService.getUser(request.token, request.userAliasA);
    const userB = await userService.getUser(request.token, request.userAliasB);
    if (!userA || !userB){
        return {
            success: false,
            message: "User not found",
            isFollower: false
        };
    }
    let isFollower = await userService.getIsFollowerStatus(request.token, userA, userB);
    return {
        success: true, 
        message: null, 
        isFollower: isFollower 
    };
}