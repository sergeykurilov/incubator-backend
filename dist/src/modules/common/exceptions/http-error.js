"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
class HTTPError extends Error {
    constructor(statusCode, message, field = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorsMessages = [{ message, field }];
    }
}
exports.HTTPError = HTTPError;
