export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (message: string) => void;
}

export abstract class Presenter<V extends View> {
    private _view: V;
    protected constructor(view: V) {
        this._view = view;
    }
    public get view(): V {
        return this._view;
    }
    public async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string, id?: string): Promise<void> {
        try {
            await operation();
        } catch (error: any) {
            this._view.displayErrorMessage(
            `Failed to ${operationDescription} because of exception: ${error.errorMessage || error.message || error}`
            );
        } finally {
            this.doFinallyOperations(id);
        }
    }

    protected doFinallyOperations(id?: string): void {};
}