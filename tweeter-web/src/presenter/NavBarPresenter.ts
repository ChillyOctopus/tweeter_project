import { AuthService } from "../model.service/AuthService";
import { AuthToken } from "tweeter-shared";

export interface NavbarView {
  displayInfoMessage(message: string, duration?: number): string;
  displayErrorMessage(message: string): void;
  deleteMessage(id: string): void;
  clearUserInfo(): void;
  navigateToLogin(): void;
}

export default class NavbarPresenter {
  private view: NavbarView;
  private authService: AuthService;

  public constructor(view: NavbarView) {
    this.view = view;
    this.authService = new AuthService();
  }

  public async handleLogout(authToken: AuthToken): Promise<void> {
    const toastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.authService.logout(authToken);
      this.view.deleteMessage(toastId);
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user out: ${error}`);
    }
  }
}
