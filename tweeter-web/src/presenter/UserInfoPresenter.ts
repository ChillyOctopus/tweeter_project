import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
    setIsFollower: (value: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private userService: UserService;

    constructor(view: UserInfoView) {
        super(view);
        this.userService = new UserService();
    }

    public async loadUserInfo(authToken: AuthToken, currentUser: User, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            const isFollower = currentUser.equals(displayedUser) ? false : await this.userService.getIsFollowerStatus(authToken, currentUser, displayedUser);
            this.setCounts(isFollower, authToken, displayedUser);
        }, "load user info")
    }

    public async follow_unfollow(authToken: AuthToken, user: User, follow: boolean) {
        let messageId = "";
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            messageId = this.view.displayInfoMessage(`${follow ? "Following " : "Unfollowing "} ${user.name}...`, 0);
            follow ? await this.userService.follow(authToken, user) : await this.userService.unfollow(authToken, user);
            this.view.deleteMessage(messageId);
            this.setCounts(follow, authToken, user);
        }, follow ? "follow user" : "unfollow user");
    }

    private async setCounts(isFollower: boolean, authToken: AuthToken, user: User) {  
        const [followerCount, followeeCount] = await this.userService.refreshCounts(authToken, user);
        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
    }
    
    protected doFinallyOperations(id?: string): void {
        this.view.setIsLoading(false);
    }
}
