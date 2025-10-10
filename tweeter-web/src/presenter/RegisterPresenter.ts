import { AuthService } from "../model.service/AuthService";
import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";

export interface RegisterView {
  showError(message: string): void;
  showLoading(isLoading: boolean): void;
  navigateToFeed(alias: string): void;
  updateUserInfo(user: User, token: AuthToken, rememberMe: boolean): void;
}

export class RegisterPresenter {
  private service: AuthService;
  private view: RegisterView;

  constructor(view: RegisterView) {
    this.view = view;
    this.service = new AuthService();
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ): Promise<void> {
    try {
      this.view.showLoading(true);
      const [user, token] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );
      this.view.updateUserInfo(user, token, rememberMe);
      this.view.navigateToFeed(user.alias);
    } catch (error) {
      this.view.showError(`Failed to register user: ${error}`);
    } finally {
      this.view.showLoading(false);
    }
  }

  getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  fileToBytes(file: File, callback: (bytes: Uint8Array) => void): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64 = result.split("base64,")[1];
      const bytes = Buffer.from(base64, "base64");
      callback(bytes);
    };
    reader.readAsDataURL(file);
  }
}
