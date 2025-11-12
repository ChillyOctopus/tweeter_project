import { useState, useEffect, useRef, ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMessageActions } from "../toaster/MessageHooks";
import { useParams } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
import { StatusItemPresenter } from "../../presenter/StatusItemPresenter";

interface Props<I, S> {
  uuid: string;
  presenterFactory: (view: PagedItemView<I>) => S;
  renderItem: (item: I, index: number) => ReactNode;
}

export default function PagedItemScroller<I, S extends UserItemPresenter | StatusItemPresenter>(props: Props<I, S>) {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<I[]>([]);
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PagedItemView<I> = {
    addItems: (newItems: I[]) => setItems((prev) => [...prev, ...newItems]),
    displayErrorMessage,
  };

  const presenterRef = useRef<S | null>(null);
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
    presenterRef.current = props.presenterFactory(listener);
    reset();
    loadMoreItems();
  }, [props.uuid]);

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
