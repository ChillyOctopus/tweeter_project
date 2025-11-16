import { AuthToken, LogoutRequest, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class AuthService {
  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    return this.loginOrRegister(
      alias,
      password,
      false,
      firstName,
      lastName,
      imageBytes,
      imageFileExtension
    );
  }

  async login(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.loginOrRegister(alias, password, true);
  }

  private async loginOrRegister(
    alias: string,
    password: string,
    isLogin: boolean,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]> {

    let request;
    if (isLogin) {
      request = {
        userAlias: alias,
        userPassword: password
      };
    } else {
      request = {
        firstName: firstName!,
        lastName: lastName!,
        alias: alias,
        password: password,
        imageBytes: imageBytes!,
        imageFileExtension: imageFileExtension!
      };
    }

    const response = isLogin
      ? await ServerFacade.instance.login(request)
      : await ServerFacade.instance.register(request);

    return [User.fromDto(response.user)!, AuthToken.fromDto(response.authToken)!];
  }

  async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      authToken: authToken.dto
    }
    await ServerFacade.instance.logout(request);
  }
  
}

