import { AuthToken, AuthTokenDto, FakeData, UserDto } from "tweeter-shared";

export class AuthService {
  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
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

  async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
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
  ): Promise<[UserDto, AuthTokenDto]> {
    const userObj = FakeData.instance.firstUser;
    const authtokenObj = FakeData.instance.authToken;;
    const user = userObj?.dto || null;
    if (!user) throw new Error("Invalid registration");
    return [user, authtokenObj.dto];
  }

  async logout(authToken: AuthTokenDto): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }
  
}

