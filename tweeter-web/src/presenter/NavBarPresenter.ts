import { AuthService } from "../model.service/AuthService";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";

export interface NavBarView extends MessageView {
  clearUserInfo(): void;
  navigateToLogin(): void;
}

export default class NavbarPresenter extends Presenter<NavBarView>{
  private _service: AuthService;

  public constructor(view: NavBarView) {
      super(view);
      this._service = new AuthService();
  }

  public get service() {
      return this._service;
  }

  public async handleLogout(authToken: AuthToken): Promise<void> {
      this.doFailureReportingOperation(async () => {
          const toastId = this.view.displayInfoMessage("Logging Out...", 0);
          await this.service.logout(authToken);
          this.view.deleteMessage(toastId);
          this.view.clearUserInfo();
          this.view.navigateToLogin();
      }, "log out user");
  }
}

