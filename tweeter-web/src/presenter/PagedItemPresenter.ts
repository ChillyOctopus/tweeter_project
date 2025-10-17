import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<I, S> extends Presenter<PagedItemView<I>> {
    private _hasMoreItems = true;
    private _lastItem: I | null = null;
    private userService: UserService = new UserService();
    private _service: S;

    public constructor(view: PagedItemView<I>) {
        super(view);
        this._service = this.serviceFactory();
    }

    public get lastItem(): I | null {
        return this._lastItem;
    }

    protected set lastItem(value: I | null) {
        this._lastItem = value;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get service(): S {
        return this._service;
    }

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    }
    
    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        this.doFailureReportingOperation(async () => {
            const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);}, this.itemDescription(), "")
    };

    protected abstract itemDescription(): string;
    
    protected abstract serviceFactory(): S; 

    protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[I[], boolean]>;

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }
}