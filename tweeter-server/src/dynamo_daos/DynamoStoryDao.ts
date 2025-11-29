import { AbstractStoryDao } from "../abstract_daos/AbstractStoryDao";

export class DynamoStoryDao extends AbstractStoryDao {
  public getFeedDao(): AbstractFeedDao {}
}