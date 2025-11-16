// Domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";
export { FakeData } from "./util/FakeData";

// DTO classes
export type { UserDto } from "./model/dto/UserDto";
export type { AuthTokenDto } from "./model/dto/AuthTokenDto";
export type { StatusDto } from "./model/dto/StatusDto";

// Requests
export type { TweeterRequest } from "./model/net/request/TweeterRequest";

export type { LoginRequest } from "./model/net/request/auth/LoginRequest";
export type { LogoutRequest } from "./model/net/request/auth/LogoutRequest";
export type { RegisterRequest } from "./model/net/request/auth/RegisterRequest";
export type { UserRequest } from "./model/net/request/auth/UserRequest";

export type { AToBRequest } from "./model/net/request/follow/AToBRequest";
export type { GetCountsRequest } from "./model/net/request/follow/GetCountsRequest";
export type { PagedUserItemRequest } from "./model/net/request/follow/PagedUserItemRequest";

export type { EchoRequest } from "./model/net/request/learning/EchoRequest";
export type { PingRequest } from "./model/net/request/learning/PingRequest";

export type { PagedStatusItemRequest } from "./model/net/request/post/PagedStatusItemRequest";
export type { PostStatusRequest } from "./model/net/request/post/PostStatusRequest";

// Responses
export type { TweeterResponse } from "./model/net/response/TweeterResponse";

export type { LoginResponse } from "./model/net/response/auth/LoginResponse";
export type { UserResponse } from "./model/net/response/auth/UserResponse";

export type { DoesAFollowBResponse } from "./model/net/response/follow/DoesAFollowBResponse";
export type { GetCountsResponse } from "./model/net/response/follow/GetCountsResponse";
export type { PagedUserItemResponse } from "./model/net/response/follow/PagedUserItemResponse";

export type { PagedStatusItemResponse } from "./model/net/response/post/PagedStatusItemResponse";
