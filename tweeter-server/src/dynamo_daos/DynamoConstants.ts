// DynamoConstants.ts

export namespace UsersTable {
  export const TABLE = "users";

  // Primary Key
  export const PK = "alias";

  // Attributes
  export const ATTR_ALIAS = "alias";
  export const ATTR_FIRST_NAME = "first_name";
  export const ATTR_LAST_NAME = "last_name";
  export const ATTR_IMAGE_URL = "image_url";
  export const ATTR_PASSWORD_HASH = "password_hash";
  export const ATTR_FOLLOWER_COUNT = "follower_count";
  export const ATTR_FOLLOWEE_COUNT = "followee_count";
}

export const TOKEN_LIFETIME_MS = 120 * 60 * 1000; // 120 minutes
export namespace AuthTokensTable {
  export const TABLE = "auth_tokens";

  export const PK = "token";

  export const ATTR_TOKEN = "token";
  export const ATTR_LAST_USED = "lastUsed";
  export const ATTR_EXPIRES_AT = "expiresAt";
}

export namespace FollowsTable {
  export const TABLE = "follow";

  // Primary Keys
  export const PK = "follower_alias";
  export const SK = "followee_alias";

  // Attributes
  export const ATTR_FOLLOWER_ALIAS = "follower_alias";
  export const ATTR_FOLLOWEE_ALIAS = "followee_alias";

  // Indexes
  export const GSI_FOLLOWEES = "FolloweesIndex";
  export const GSI_FOLLOWEES_PK = "followee_alias";
  export const GSI_FOLLOWEES_SK = "follower_alias";
}

export namespace StoryTable {
  export const TABLE = "story";

  // Primary Keys
  export const PK = "userAlias";
  export const SK = "timestamp";

  // Attributes
  export const ATTR_ALIAS = "userAlias";
  export const ATTR_TIMESTAMP = "timestamp";
  export const ATTR_POST = "post";
  export const ATTR_USER_OBJECT = "userObject";
}

export namespace PostQueue { export const URL = "https://sqs.us-east-2.amazonaws.com/825765417292/tweeter-post-queue"; }
export namespace JobQueue { export const URL = "https://sqs.us-east-2.amazonaws.com/825765417292/tweeter-job-queue"; }

export namespace FeedTable {
  export const TABLE = "feed1";

  // Primary Keys
  export const PK = "userAlias";
  export const SK = "timestamp";

  // Attributes
  export const ATTR_ALIAS = "userAlias";
  export const ATTR_TIMESTAMP = "timestamp";
  export const ATTR_POST = "post";
  export const ATTR_USER_OBJECT = "userObject";
}
