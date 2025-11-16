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
    let response;
    if (isLogin) {
      request = {
        userAlias: alias,
        userPassword: password
      };
      response = await ServerFacade.instance.login(request);
    } else {
      request = {
        firstName: firstName!,
        lastName: lastName!,
        alias: alias,
        password: password,
        imageBytes: imageBytes!,
        imageFileExtension: imageFileExtension!
      };
      response = await ServerFacade.instance.register(request);
    }

    return [User.fromDto(response.user)!, AuthToken.fromDto(response.token)!];
  }

  async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.dto
    }
    await ServerFacade.instance.logout(request);
  }
  
}

