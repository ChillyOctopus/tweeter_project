import { AbstractDaoFactory } from "../abstract_daos/AbstractDaoFactory";
import { DynamoStatusDao } from "./DynamoStatusDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { DynamoS3Dao } from "./DynamoS3Dao";
import { DynamoUserDao } from "./DynamoUserDao";

export class DynamoDaoFactory extends AbstractDaoFactory {
  public getStatusDao(): DynamoStatusDao {
    return new DynamoStatusDao();
  }
  public getFollowDao(): DynamoFollowDao {
    return new DynamoFollowDao();
  }
  public getUserDao(): DynamoUserDao {
    return new DynamoUserDao();
  }
  public getS3Dao(): DynamoS3Dao {
    return new DynamoS3Dao();
  }
}
