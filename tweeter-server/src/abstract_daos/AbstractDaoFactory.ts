import { AbstractFeedDao } from "./AbstractFeedDao";
import { AbstractFollowDao } from "./AbstractFollowDao";
import { AbstractS3Dao } from "./AbstractS3Dao";
import { AbstractStoryDao } from "./AbstractStoryDao";
import { AbstractUserDao } from "./AbstractUserDao";

export abstract class AbstractDaoFactory {
  public abstract getFeedDao(): AbstractFeedDao
  public abstract getFollowDao(): AbstractFollowDao
  public abstract getStoryDao(): AbstractStoryDao
  public abstract getUserDao(): AbstractUserDao
  public abstract getS3Dao(): AbstractS3Dao
}