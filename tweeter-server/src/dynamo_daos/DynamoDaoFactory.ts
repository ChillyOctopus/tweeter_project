import { AbstractDaoFactory } from "../abstract_daos/AbstractDaoFactory";
import { DynamoStatusDao } from "./DynamoStatusDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { DynamoS3Dao } from "./DynamoS3Dao";
import { DynamoAuthDao } from "./DynamoAuthDao";

export class DynamoDaoFactory extends AbstractDaoFactory {
  public getStatusDao(): DynamoStatusDao {
    return new DynamoStatusDao();
  }
  public getFollowDao(): DynamoFollowDao {
    return new DynamoFollowDao();
  }
  public getAuthDao(): DynamoAuthDao {
    return new DynamoAuthDao();
  }
  public getS3Dao(): DynamoS3Dao {
    return new DynamoS3Dao();
  }
}
