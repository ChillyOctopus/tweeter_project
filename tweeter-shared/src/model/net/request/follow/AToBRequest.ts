import { UserDto } from "../../../dto/UserDto";

export interface AToBRequest {
    readonly token: string;
    readonly userAliasA: string;
    readonly userAliasB: string;
}