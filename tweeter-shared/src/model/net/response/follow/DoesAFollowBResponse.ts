import { TweeterResponse } from "../TweeterResponse";

export interface DoesAFollowBResponse extends TweeterResponse{
    readonly isFollower: boolean;
} 