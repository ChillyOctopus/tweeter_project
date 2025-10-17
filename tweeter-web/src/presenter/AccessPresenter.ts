import { AuthService } from "../model.service/AuthService";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";
import { User, AuthToken } from "tweeter-shared";
import { getTokenSourceMapRange } from "typescript";

export interface LoginRegisterView extends View {
    showLoading: (isLoading: boolean) => void;
    navigateToFeed: (alias: string) => void;
    updateUserInfo: (user: User, token: AuthToken, rememberMe: boolean) => void;
}

export class AccessPresenter extends Presenter<LoginRegisterView> {
    protected service: AuthService;

    constructor(view: LoginRegisterView) {
        super(view);
        this.service = new AuthService();
    }

    beginAccess(): void {
        this.view.showLoading(true);
    }

    endAccess(user: User, token: AuthToken, rememberMe: boolean): void {
        this.view.updateUserInfo(user, token, rememberMe);
        this.view.navigateToFeed(user.alias);
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

    protected doFinallyOperations(id?: string): void {
        this.view.showLoading(false);
    }
}
