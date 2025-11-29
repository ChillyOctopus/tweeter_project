import { AbstractUserDao } from "../abstract_daos/AbstractUserDao";

export class DynamoUserDao extends AbstractUserDao {
  public getFeedDao(): AbstractFeedDao {}
}