import { useState, useEffect, useRef, ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMessageActions } from "../toaster/MessageHooks";
import { useParams } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import { PagedItemPresenter, PagedItemView } from "../../presenter/PagedItemPresenter";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
import { StatusItemPresenter } from "../../presenter/StatusItemPresenter";

interface Props<T, P> {
  uuid: string;
  presenterFactory: (view: PagedItemView<T>) => P;
  renderItem: (item: T, index: number) => ReactNode;
}

export default function PagedItemScroller<T, P extends UserItemPresenter | StatusItemPresenter>(props: Props<T, P>) {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) => setItems((prev) => [...prev, ...newItems]),
    displayErrorMessage,
  };

  const presenterRef = useRef<P | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser?.alias &&
      presenterRef.current?.getUser
    ) {
      presenterRef.current!.getUser(authToken!, displayedUserAliasParam).then((toUser) => {
        if (toUser) setDisplayedUser(toUser);
      });
    }
  }, [displayedUserAliasParam]);

  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems([]);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUserAliasParam!);
  };

  return (
    <div className="container px-0 overflow-visible vh-100" key={props.uuid}>
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
            {props.renderItem(item, index)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
