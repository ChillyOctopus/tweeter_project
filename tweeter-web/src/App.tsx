import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import { LoginRegisterView } from "./presenter/AccessPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { RegisterPresenter } from "./presenter/RegisterPresenter";
import UserItem from "./components/userItem/UserItem";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<ItemScroller uuid={`feed-${displayedUser!.alias}`} presenterFactory={(view: PagedItemView<Status>) => new FeedPresenter(view)} renderItem={(status: Status) => (<StatusItem item={status} featurePath={"/feed"} /> )} /> } />
        <Route path="story/:displayedUser" element={<ItemScroller uuid={`story-${displayedUser!.alias}`} presenterFactory={(view: PagedItemView<Status>) => new StoryPresenter(view)} renderItem={(status: Status) => (<StatusItem item={status} featurePath={"/story"} /> )}/>} />
        <Route path="followees/:displayedUser" element={<ItemScroller uuid={`followees-${displayedUser!.alias}`} presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)} renderItem={(user: User) => (<UserItem user={user} featurePath={"/followees"} /> )}/>} />
        <Route path="followers/:displayedUser" element={<ItemScroller uuid={`followers-${displayedUser!.alias}`} presenterFactory={(view: PagedItemView<User>) => new FollowerPresenter(view)} renderItem={(user: User) => (<UserItem user={user} featurePath={"/followees"} /> )}/>} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login uuid={`login-${location.hash}`} originalUrl="/login" presenterFactory={(view: LoginRegisterView) => new LoginPresenter(view)} />} />
      <Route path="/register" element={<Register uuid={`register-${location.hash}`} originalUrl="/register" presenterFactory={(view: LoginRegisterView) => new RegisterPresenter(view)} />} />
      <Route path="*" element={<Login uuid={`login-${location.hash}`} originalUrl={location.pathname} presenterFactory={(view: LoginRegisterView) => new LoginPresenter(view)} />} />
    </Routes>
  );
};

export default App;
