import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { FollowService } from "../model.service/FollowService";

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
    protected serviceFactory(): FollowService {
        return new FollowService();
    }
}