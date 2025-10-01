import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";

export const useUserInfoActions = () => {
    return useContext(UserInfoActionsContext);
}

export const useUserInfo = () => {
    return useContext(UserInfoContext);
}

const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
};

const getUser = async (
    authToken: AuthToken,
    alias: string
    ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
};

export const useUserNavigation = (featurePath: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  return async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());
      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  };
}
