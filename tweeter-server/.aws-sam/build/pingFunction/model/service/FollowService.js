"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        return this.loadMoreFollowersOrFollowees(token, userAlias, pageSize, lastItem, false);
    }
    ;
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        return this.loadMoreFollowersOrFollowees(token, userAlias, pageSize, lastItem, true);
    }
    ;
    async loadMoreFollowersOrFollowees(token, userAlias, pageSize, lastItem, fetchFollowers) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
    ;
}
exports.FollowService = FollowService;
