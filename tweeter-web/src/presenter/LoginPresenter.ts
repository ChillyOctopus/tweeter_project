import { AuthService } from "../model.service/AuthService";
import { AuthToken, User } from "tweeter-shared";

export interface LoginView {
  showError(message: string): void;
  showLoading(isLoading: boolean): void;
  navigateToFeed(alias: string): void;
  updateUserInfo(user: User, token: AuthToken, rememberMe: boolean): void;
}

export class LoginPresenter {
  private service: AuthService;
  private view: LoginView;

  constructor(view: LoginView) {
    this.view = view;
    this.service = new AuthService();
  }

  async login(
    alias: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    try {
      this.view.showLoading(true);
      const [user, token] = await this.service.login(alias, password);
      this.view.updateUserInfo(user, token, rememberMe);
      this.view.navigateToFeed(user.alias);
    } catch (error) {
      this.view.showError(`Failed to log user in: ${error}`);
    } finally {
      this.view.showLoading(false);
    }
  }
}
