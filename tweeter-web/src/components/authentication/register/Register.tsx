// src/auth/views/RegisterView.tsx
import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState, ChangeEvent, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { RegisterPresenter } from "../../../presenter/RegisterPresenter";
import { AuthToken, User } from "tweeter-shared";
import { LoginRegisterView } from "../../../presenter/AccessPresenter";

interface Props {
  uuid: string;
  presenterFactory: (view: LoginRegisterView) => RegisterPresenter;
}

const Register = (props: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageFileExtension, setImageFileExtension] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  const { updateUserInfo } = useUserInfoActions();

  const listener: LoginRegisterView = {
    showLoading: (isLoading: boolean) => setIsLoading(isLoading),
    navigateToFeed: (alias: string) => {
      navigate(`/${alias}`);
    },
    updateUserInfo: (user: User, token: AuthToken, rememberMe: boolean) => {
      updateUserInfo(user, user, token, rememberMe);
    },
    displayErrorMessage: displayErrorMessage
  };

  const presenterRef = useRef<RegisterPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };
  
  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doRegister();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    const ext = presenterRef.current!.getFileExtension(file);
    if (ext) setImageFileExtension(ext);
    presenterRef.current!.fileToBytes(file, setImageBytes);
  };

  const doRegister = () =>
    presenterRef.current!.register(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension,
      rememberMe
    );

  const checkDisabled = !firstName || !lastName || !alias || !password || !imageUrl;

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={() => (
        <>
          <div className="form-floating">
            <input className="form-control" id="firstNameInput" placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)} />
            <label htmlFor="firstNameInput">First Name</label>
          </div>
          <div className="form-floating">
            <input className="form-control" id="lastNameInput" placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)} />
            <label htmlFor="lastNameInput">Last Name</label>
          </div>
          <AuthenticationFields
            onKeyDownFn={registerOnEnter}
            alias={alias} setAlias={setAlias}
            password={password} setPassword={setPassword}
          />
          <div className="form-floating mb-3">
            <input type="file" className="form-control"
              onChange={handleFileChange} />
            {imageUrl && <img src={imageUrl} className="img-thumbnail" alt="" />}
          </div>
        </>
      )}
      switchAuthenticationMethodFactory={() => (
        <div>Already registered? <Link to="/login">Sign in</Link></div>
      )}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => checkDisabled}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
