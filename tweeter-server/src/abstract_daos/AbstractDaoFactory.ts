import { AbstractStatusDao } from "./AbstractStatusDao";
import { AbstractFollowDao } from "./AbstractFollowDao";
import { AbstractS3Dao } from "./AbstractS3Dao";
import { AbstractUserDao } from "./AbstractUserDao";

export abstract class AbstractDaoFactory {
  public abstract getStatusDao(): AbstractStatusDao
  public abstract getFollowDao(): AbstractFollowDao
  public abstract getUserDao(): AbstractUserDao
  public abstract getS3Dao(): AbstractS3Dao
}