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
