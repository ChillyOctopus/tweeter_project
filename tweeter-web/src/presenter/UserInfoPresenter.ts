import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserInfoView {
    setIsFollower: (value: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (value: boolean) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    displayErrorMessage: (message: string) => void;
    deleteMessage: (toastId: string) => void;
}

export class UserInfoPresenter {
    private view: UserInfoView;
    private userService: UserService;

    constructor(view: UserInfoView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async loadUserInfo(authToken: AuthToken, currentUser: User, displayedUser: User) {
        try {
            const isFollower = currentUser.equals(displayedUser) ? false : await this.userService.getIsFollowerStatus(authToken, currentUser, displayedUser);

            const followerCount = await this.userService.getFollowerCount(authToken, displayedUser);
            const followeeCount = await this.userService.getFolloweeCount(authToken, displayedUser);

            this.view.setIsFollower(isFollower);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to load user info: ${error}`);
        }
    }

    public async followUser(authToken: AuthToken, user: User) {
        let toastId = "";
        try {
            this.view.setIsLoading(true);
            toastId = this.view.displayInfoMessage(`Following ${user.name}...`, 0);
            await this.userService.follow(authToken, user);

            const [followerCount, followeeCount] = await this.userService.refreshCounts(authToken, user);
            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to follow user: ${error}`);
        } finally {
            this.view.deleteMessage(toastId);
            this.view.setIsLoading(false);
        }
    }

    public async unfollowUser(authToken: AuthToken, user: User) {
        let toastId = "";
        try {
            this.view.setIsLoading(true);
            toastId = this.view.displayInfoMessage(`Unfollowing ${user.name}...`, 0);
            await this.userService.unfollow(authToken, user);

            const [followerCount, followeeCount] = await this.userService.refreshCounts(authToken, user);
            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to unfollow user: ${error}`);
        } finally {
            this.view.deleteMessage(toastId);
            this.view.setIsLoading(false);
        }
    }
}
