import { TweeterRequest } from "../TweeterRequest";
import { AuthTokenDto } from "../../../dto/AuthTokenDto";

export interface AToBRequest extends TweeterRequest{
    readonly token: AuthTokenDto;
    readonly userAliasA: string;
    readonly userAliasB: string;
}