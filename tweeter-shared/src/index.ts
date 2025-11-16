// Domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";
export { FakeData } from "./util/FakeData";

// DTO classes
export type { UserDto } from "./model/dto/UserDto";

// Requests
export type { TweeterRequest } from "./model/net/request/TweeterRequest";
export type { PagedUserItemRequest } from "./model/net/request/follow/PagedUserItemRequest";
export type { EchoRequest } from "./model/net/request/learning/EchoRequest";
export type { PingRequest } from "./model/net/request/learning/PingRequest";

// Responses
export type { TweeterResponse } from "./model/net/response/TweeterResponse";
export type { PagedUserItemResponse } from "./model/net/response/follow/PagedUserItemResponse";

// Network
// export { ClientCommunicator } from "./model/net/ClientCommunicator";
// export { ServerFacade } from "./model/net/ServerFacade";