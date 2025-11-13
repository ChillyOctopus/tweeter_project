import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "@typestrong/ts-mockito"
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
    it("starts with the sign in button disabled", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    })

    it("enables the sign in button if both alias and password fields have text", async () => {
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");
        await user.type(aliasField, "a");
        await user.type(passwordField, "b");
        expect(signInButton).toBeEnabled();
        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();
        await user.type(aliasField, "a");
        expect(signInButton).toBeEnabled();
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    })

    it("calls the login method's presenter is called with correct parameters when the sign-in button is pressed.", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const originalUrl = "testUrl";
        const alias = "testAlias";
        const password = "testPassword";
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements(originalUrl, mockPresenterInstance);
        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);
        verify(mockPresenter.login(alias, password, false)).once();
    })
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (<Login presenter={presenter} uuid="test-login" />) : (<Login uuid="test-login" />)} 
            <Login uuid={""} />
        </MemoryRouter>
    );
}

function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();
    renderLogin(originalUrl, presenter ? presenter : undefined);
    const signInButton = screen.getAllByRole("button", { name: /Sign in/i})[0];
    const aliasField = screen.getAllByLabelText("alias")[0];
    const passwordField = screen.getAllByLabelText("password")[0];

    return { user, signInButton, aliasField, passwordField };
}