import { AuthToken } from "tweeter-shared";
import NavbarPresenter, { NavBarView } from "../../src/presenter/NavBarPresenter"
import { UserService } from "../../src/model.service/UserService";
import { anything, instance, mock, spy, verify, when, capture } from "@typestrong/ts-mockito" 
import { AuthService } from "../../src/model.service/AuthService";

describe("AppNavbarPresenter", () => {
    // We use the mocks when STUBBING or VERIFYING, and the instances EVERYWHERE else
    let mockNavBarPresenterView: NavBarView;
    let navBarPresenter: NavbarPresenter;
    let mockService: AuthService;
    const authToken = new AuthToken("test-token", Date.now());

    beforeEach(() => {
        mockNavBarPresenterView = mock<NavBarView>();
        const mockNavBarPresenterViewInstance = instance(mockNavBarPresenterView);
        const navBarPresenterSpy = spy(new NavbarPresenter(mockNavBarPresenterViewInstance));
        navBarPresenter = instance(navBarPresenterSpy);
        mockService = mock<AuthService>();
        when(navBarPresenterSpy.service).thenReturn(instance(mockService));
        when(mockNavBarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("test-toast-id");
    });

    it("tells the view to display a logging out message", async () => {
        await navBarPresenter.handleLogout(authToken);
        verify(mockNavBarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    })

    it("calls logout on the user service with the correct auth token", async () => {
        await navBarPresenter.handleLogout(authToken);
        verify(mockService.logout(authToken)).once();
    })

    it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when successful", async () => {
        await navBarPresenter.handleLogout(authToken);
        verify(mockNavBarPresenterView.deleteMessage("test-toast-id")).once();
        verify(mockNavBarPresenterView.clearUserInfo()).once();
        verify(mockNavBarPresenterView.navigateToLogin()).once();
        verify(mockNavBarPresenterView.displayErrorMessage(anything())).never();
    })

    it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccessful", async () => {
        let error = new Error("A test error occurred.")
        when(mockService.logout(anything())).thenThrow(error);
        await navBarPresenter.handleLogout(authToken);
        verify(mockNavBarPresenterView.displayErrorMessage(`Failed to log out user because of exception: ${error}`)).once();
        verify(mockNavBarPresenterView.clearUserInfo()).never();
        verify(mockNavBarPresenterView.navigateToLogin()).never();
    })

    /*
    // Other tricks:

    // Getting the args / capturing the params
    it("calls logout on the user service with the correct auth token", async () => {
        await navBarPresenter.handleLogout(authToken);
        let [capturedAuthToken] = capture(mockService.logout).last();
        expect(capturedAuthToken).toBe(authToken);
    })
    */
})