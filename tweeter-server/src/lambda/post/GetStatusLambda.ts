import { StatusService } from "../../model/service/StatusService";
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService();
    const [statusArray, hasMore] = await statusService.loadMoreStory(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: statusArray,
        hasMore: hasMore
    }
}