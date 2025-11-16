import { UserService } from "../../model/service/UserService";
import { AToBRequest } from "tweeter-shared";

export const handler = async (request: AToBRequest): Promise<boolean> => {
    const userService = new UserService();
    const userA = await userService.getUser(request.token, request.userAliasA);
    const userB = await userService.getUser(request.token, request.userAliasB);
    if (!userA || !userB) return false;
    let isFollower = await userService.getIsFollowerStatus(request.token, userA, userB);
    return isFollower;
}