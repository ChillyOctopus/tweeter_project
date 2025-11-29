import { AbstractDaoFactory } from "../abstract_daos/AbstractDaoFactory";
import { DynamoFeedDao } from "./DynamoFeedDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { DynamoStoryDao } from "./DynamoStoryDao";
import { DynamoUserDao } from "./DynamoUserDao";

export class DynamoDaoFactory extends AbstractDaoFactory {
  public getFeedDao(): DynamoFeedDao {
    return new DynamoFeedDao();
  }
  public getFollowDao(): DynamoFollowDao {
    return new DynamoFollowDao();
  }
  public getStoryDao(): DynamoStoryDao {
    return new DynamoStoryDao();
  }
  public getUserDao(): DynamoUserDao {
    return new DynamoUserDao();
  }
}
