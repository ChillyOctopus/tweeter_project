"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
class PostService {
    async postStatus(authToken, status) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
}
exports.PostService = PostService;
