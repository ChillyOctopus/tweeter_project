import { RegisterRequest, LoginResponse } from "tweeter-shared";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (event: RegisterRequest): Promise<LoginResponse> => {
    const authService = new AuthService();
    const [user, authToken] = await authService.register(
        event.firstName,
        event.lastName,
        event.alias,
        event.password,
        event.imageBytes,
        event.imageFileExtension
    );
    return {
        success: true,
        message: null,
        user: user,
        token: authToken,
    };
}
