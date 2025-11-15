import { TweeterResponse, EchoRequest } from "tweeter-shared";

export const handler = async (request: EchoRequest): Promise<TweeterResponse> => { 
    return {
        success: true,
        message: request.voice
    }
} 