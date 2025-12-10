import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserService } from "../../model.service/UserService";

export const useUserInfoActions = () => useContext(UserInfoActionsContext);
export const useUserInfo = () => useContext(UserInfoContext);

export const useUserNavigation = (featurePath: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const userService = new UserService();

  return async (
    event: React.MouseEvent<HTMLAnchorElement>,
    alias: string
  ): Promise<void> => {

    event.preventDefault();

    try {
      const toUser = await userService.getUser(authToken!, alias);
      if (toUser && (!displayedUser || !toUser.equals(displayedUser))) {
        setDisplayedUser(toUser);
        navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error: any) {
      displayErrorMessage(`Failed to get user because of exception: ${error.errorMessage || error.message || error}`);
    }
  };
};

