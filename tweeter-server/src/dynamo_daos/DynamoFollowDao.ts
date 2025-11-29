import { AbstractFollowDao } from "../abstract_daos/AbstractFollowDao";

export class DynamoFollowDao extends AbstractFollowDao {
  public getFeedDao(): AbstractFeedDao {}
}