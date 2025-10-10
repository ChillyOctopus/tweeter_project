import { AuthToken, FakeData, User } from "tweeter-shared";

export class AuthService {
  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Invalid registration");
    return [user, FakeData.instance.authToken];
  }

  async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Invalid alias or password");
    return [user, FakeData.instance.authToken];
  }

  async logout(authToken: AuthToken): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }
  
}

