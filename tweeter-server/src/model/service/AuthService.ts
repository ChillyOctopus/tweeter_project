import { AuthTokenDto, UserDto } from "tweeter-shared";
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
    return this.loginOrRegister(alias, password, false, firstName, lastName, imageBytes, imageFileExtension);
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
    const userDao = this.factory.getUserDao();
    let userDto = {firstName: firstName!, lastName: lastName!, alias: alias, imageUrl: imageBytes!.toString()}; // TODO: Fix the 'imageUrl' to be whatever it needs to be
    return isLogin ? userDao.login(alias, password) : userDao.register(userDto, password);
  }

  async logout(authToken: AuthTokenDto): Promise<void> {
    let success = this.factory.getUserDao().logout(authToken);
    if (!success) {
      throw new Error("Logout was not successful.");
    }
  }
  
}

