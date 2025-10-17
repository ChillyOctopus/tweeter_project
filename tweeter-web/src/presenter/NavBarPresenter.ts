import { AuthService } from "../model.service/AuthService";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo(): void;
  navigateToLogin(): void;
}

export default class NavbarPresenter extends Presenter<NavbarView>{
  private authService: AuthService;

  public constructor(view: NavbarView) {
      super(view);
      this.authService = new AuthService();
  }

  public async handleLogout(authToken: AuthToken): Promise<void> {
      this.doFailureReportingOperation(async () => {
          const toastId = this.view.displayInfoMessage("Logging Out...", 0);
          await this.authService.logout(authToken);
          this.view.deleteMessage(toastId);
          this.view.clearUserInfo();
          this.view.navigateToLogin();
      }, "log out user");
  }
}

