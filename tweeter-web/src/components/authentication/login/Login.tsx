// src/auth/views/LoginView.tsx
import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthToken, User } from "tweeter-shared"
import { LoginRegisterView } from "../../../presenter/AccessPresenter";

interface Props {
  uuid: string;
  originalUrl?: string;
  presenterFactory: (view: LoginRegisterView) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  const { updateUserInfo } = useUserInfoActions();

  const listener: LoginRegisterView = {
    showLoading: (isLoading: boolean) => setIsLoading(isLoading),
    navigateToFeed: (alias: string) => {
      if (props.originalUrl) {
        window.location.href = props.originalUrl;
      } else {
        navigate(`/${alias}`);
      }
    },
    updateUserInfo: (user: User, token: AuthToken, rememberMe: boolean) => {
      updateUserInfo(user, null, token, rememberMe);
    },
    displayErrorMessage: displayErrorMessage
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const doLogin = () => presenterRef.current!.login(alias, password, rememberMe);

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };
  
  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={() => (
        <AuthenticationFields
          onKeyDownFn={loginOnEnter}
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