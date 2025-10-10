import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Status, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useParams } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import StatusItem from "../statusItem/StatusItem";
import { StatusItemPresenter, StatusItemView } from "../../presenter/StatusItemPresenter";

interface Props {
  uuid: string;
  featureUrl: string;
  presenterFactory: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<Status[]>([]);
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) =>
    setItems((previous) => [...previous, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<StatusItemPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser!.alias
    ) {
      presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        } 
      });
    }
  }, [displayedUserAliasParam]);

  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem item={item} featurePath={props.featureUrl} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
