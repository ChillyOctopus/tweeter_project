import { AuthService } from "../../model/service/AuthService";
import { LoginRequest, LoginResponse } from "tweeter-shared";

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
    const authService = new AuthService();
    const [user, token] = await authService.login(request.userAlias, request.userPassword);
    return {
        success: true,
        message: null,
        user: user.dto,
        token: token
    }
}
