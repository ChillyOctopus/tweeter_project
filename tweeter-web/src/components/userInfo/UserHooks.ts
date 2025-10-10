import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserService } from "../../model.service/UserService";

export const useUserInfoActions = () => useContext(UserInfoActionsContext);
export const useUserInfo = () => useContext(UserInfoContext);

const extractAlias = (value: string): string => {
  const index = value.indexOf("@");
  return value.substring(index);
};

export const useUserNavigation = (featurePath: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const userService = new UserService();

  return async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());
      const toUser = await userService.getUser(authToken!, alias);

      if (toUser && (!displayedUser || !toUser.equals(displayedUser))) {
        setDisplayedUser(toUser);
        navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };
};

//TODO put extract alias into a presenter, and most of the other logic. The view will have basically event.target.toString, need 'navigate' here in the hook.