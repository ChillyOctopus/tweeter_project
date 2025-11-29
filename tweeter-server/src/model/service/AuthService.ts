import { AuthToken, AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";

export class AuthService {
  private factory = new DynamoDaoFactory();

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    return this.factory.getUserDao().register();
  }

  async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    return this.factory.getUserDao().login();
  }

  // private async loginOrRegister(
  //   alias: string,
  //   password: string,
  //   isLogin: boolean,
  //   firstName?: string,
  //   lastName?: string,
  //   imageBytes?: Uint8Array,
  //   imageFileExtension?: string
  // ): Promise<[UserDto, AuthTokenDto]> {
  //   const userObj = FakeData.instance.firstUser;
  //   const authtokenObj = FakeData.instance.authToken;;
  //   const user = userObj?.dto || null;
  //   if (!user) throw new Error("Invalid registration");
  //   return [user, authtokenObj.dto];
  // }

  async logout(authToken: AuthTokenDto): Promise<void> {
    let success = this.factory.getUserDao().logout();
    if (!success) {
      throw new Error("Logout was not successful.");
    }
  }
  
}

