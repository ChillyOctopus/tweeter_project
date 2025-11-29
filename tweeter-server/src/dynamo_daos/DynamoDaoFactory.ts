import { AbstractDaoFactory } from "../abstract_daos/AbstractDaoFactory";
import { AbstractS3Dao } from "../abstract_daos/AbstractS3Dao";
import { DynamoFeedDao } from "./DynamoFeedDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { DynamoS3Dao } from "./DynamoS3Dao";
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
  public getS3Dao(): DynamoS3Dao {
    return new DynamoS3Dao();
  }
}
