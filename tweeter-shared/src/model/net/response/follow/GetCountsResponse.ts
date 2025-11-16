import { TweeterResponse } from "../TweeterResponse";

export interface GetCountsResponse extends TweeterResponse{
    readonly followees: number;
    readonly followers: number;
} 