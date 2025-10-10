// src/auth/views/LoginView.tsx
import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { LoginPresenter, LoginView as ILoginView } from "../../../presenter/LoginPresenter";
import { AuthToken, User } from "tweeter-shared";

interface Props {
  originalUrl?: string;
}

const Login = ({ originalUrl }: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  const { updateUserInfo } = useUserInfoActions();

  const presenter = new LoginPresenter({
    showError: displayErrorMessage,
    showLoading: setIsLoading,
    navigateToFeed: (alias: string) => navigate(originalUrl || `/feed/${alias}`),
    updateUserInfo: (user: User, token: AuthToken, remember: boolean) =>
      updateUserInfo(user, user, token, remember),
  } as ILoginView);

  const doLogin = () => presenter.login(alias, password, rememberMe);

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={() => (
        <AuthenticationFields
          alias={alias} setAlias={setAlias}
          password={password} setPassword={setPassword}
        />
      )}
      switchAuthenticationMethodFactory={() => (
        <div>Not registered? <Link to="/register">Register</Link></div>
      )}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => !alias || !password}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;

// TODO ILoginView should probably not be casted, make typescript tell you what to do. const listener.