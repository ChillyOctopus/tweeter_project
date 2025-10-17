import { AccessPresenter } from "./AccessPresenter";

export class LoginPresenter extends AccessPresenter {

    async login(alias: string, password: string, rememberMe: boolean): Promise<void> {
        this.doFailureReportingOperation(async () => {
            this.beginAccess();
            const [user, token] = await this.service.login(alias, password);
            this.endAccess(user, token, rememberMe);
        }, "log user in");
    }
}
