import { Buffer } from "buffer";
import { AccessPresenter } from "./AccessPresenter";

export class RegisterPresenter extends AccessPresenter {

    async register(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean): Promise<void> {
        this.doFailureReportingOperation(async () => {
            this.beginAccess();
            const [user, token] = await this.service.register(firstName, lastName, alias, password, imageBytes, imageFileExtension);
            this.endAccess(user, token, rememberMe);
          }, "register user");
    }
}
