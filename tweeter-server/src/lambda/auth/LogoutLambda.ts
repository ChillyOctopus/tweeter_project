import { AuthService } from "../../model/service/AuthService";
import { LogoutRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
    const authService = new AuthService();
    await authService.logout(request.token);
    return {
        success: true,
        message: null
    }
}
