"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    async loadMoreFeed(authToken, userAlias, pageSize, lastItem) {
        return this.loadMoreStoryOrFeed(authToken, userAlias, pageSize, lastItem, false);
    }
    async loadMoreStory(authToken, userAlias, pageSize, lastItem) {
        return this.loadMoreStoryOrFeed(authToken, userAlias, pageSize, lastItem, true);
    }
    async loadMoreStoryOrFeed(authToken, userAlias, pageSize, lastItem, fetchStory) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(tweeter_shared_1.Status.fromDto(lastItem), pageSize);
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }
}
exports.StatusService = StatusService;
