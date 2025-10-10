import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface StatusItemView {
    addItems: (newItems: any[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
    private _view: StatusItemView;
    private _hasMoreItems = true;
    private _lastItem: any | null = null;
    private userService: UserService = new UserService();

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    }

    protected constructor(view: StatusItemView) {
        this._view = view;
    }

    protected get view(): StatusItemView {
        return this._view;
    }

    public get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: any | null) {
        this._lastItem = value;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }
}
