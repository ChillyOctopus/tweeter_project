import { AbstractFeedDao } from "./AbstractFeedDao";
import { AbstractFollowDao } from "./AbstractFollowDao";
import { AbstractStoryDao } from "./AbstractStoryDao";
import { AbstractUserDao } from "./AbstractUserDao";

export abstract class AbstractDaoFactory {
  public abstract getFeedDao(): AbstractFeedDao
  public abstract getFollowDao(): AbstractFollowDao
  public abstract getStoryDao(): AbstractStoryDao
  public abstract getUserDao(): AbstractUserDao
}