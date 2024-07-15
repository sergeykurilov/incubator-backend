"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_IDENTIFIER = void 0;
exports.SERVICE_IDENTIFIER = {
    Application: Symbol.for("Application"),
    ILogger: Symbol.for("ILogger"),
    ErrorHandler: Symbol.for("ErrorHandler"),
    ExceptionFilter: Symbol.for("ExceptionFilter"),
    Video: Symbol.for("Video"),
    VideoController: Symbol.for("VideoController"),
    VideoService: Symbol.for("VideoService"),
    VideoRepository: Symbol.for("VideoRepository"),
    Blog: Symbol.for("Blog"),
    BlogController: Symbol.for("BlogController"),
    BlogRepository: Symbol.for("BlogRepository"),
    BlogService: Symbol.for("BlogService"),
    Post: Symbol.for("Post"),
    PostController: Symbol.for("PostController"),
    PostRepository: Symbol.for("PostRepository"),
    PostService: Symbol.for("PostService"),
    ConfigService: Symbol.for("ConfigService"),
    MongoDBService: Symbol.for("MongoDBService"),
};
