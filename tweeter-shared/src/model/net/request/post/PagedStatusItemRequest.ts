import { TweeterRequest } from "../TweeterRequest";
import { AuthTokenDto } from "../../../dto/AuthTokenDto";
import { StatusDto } from "../../../dto/StatusDto";

export interface PagedStatusItemRequest extends TweeterRequest {
    readonly token: AuthTokenDto;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: StatusDto | null;
}