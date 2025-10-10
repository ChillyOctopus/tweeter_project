import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import { UserService } from "../model.service/UserService";

export interface UserItemView {
    addItems: (newItems: User[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
    private _view: UserItemView;
    private _hasMoreItems = true;
    private _lastItem: User | null = null;
    private userService: UserService = new UserService();

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };
    
    protected constructor(view: UserItemView) {
        this._view = view;
    }

    protected get view(): UserItemView {
        return this._view;
    }

    public get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: User | null) {
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