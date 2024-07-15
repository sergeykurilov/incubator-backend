"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appBindings = void 0;
const inversify_1 = require("inversify");
const app_1 = require("./app");
require("reflect-metadata");
const config_service_1 = require("./config/config.service");
const database_service_1 = require("./database/database.service");
const video_service_1 = require("./modules/video/services/video.service");
const video_controller_1 = require("./modules/video/controllers/video.controller");
const video_repository_1 = require("./modules/video/repositories/video.repository");
const service_identifiers_consts_1 = require("./modules/common/consts/service-identifiers.consts");
const logger_service_1 = require("./modules/common/logger/logger.service");
const exception_filter_1 = require("./modules/common/exceptions/exception.filter");
const blog_service_1 = require("./modules/blog/services/blog.service");
const blog_controller_1 = require("./modules/blog/controllers/blog.controller");
const blog_repository_1 = require("./modules/blog/repositories/blog.repository");
const post_service_1 = require("./modules/post/services/post.service");
const post_controller_1 = require("./modules/post/controllers/post.controller");
const post_repository_1 = require("./modules/post/repositories/post.repository");
const dotenv_1 = __importDefault(require("dotenv"));
exports.appBindings = new inversify_1.ContainerModule((bind) => {
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.ILogger)
        .to(logger_service_1.LoggerService)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.ExceptionFilter)
        .to(exception_filter_1.ExceptionFilter)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.Application).to(app_1.App).inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.VideoService)
        .to(video_service_1.VideoService)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.VideoController)
        .to(video_controller_1.VideoController)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.VideoRepository)
        .to(video_repository_1.VideoRepository)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.BlogService)
        .to(blog_service_1.BlogService)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.BlogController)
        .to(blog_controller_1.BlogController)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.BlogRepository)
        .to(blog_repository_1.BlogRepository)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.PostService)
        .to(post_service_1.PostService)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.PostController)
        .to(post_controller_1.PostController)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.PostRepository)
        .to(post_repository_1.PostRepository)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.MongoDBService)
        .to(database_service_1.MongoDBService)
        .inSingletonScope();
    bind(service_identifiers_consts_1.SERVICE_IDENTIFIER.ConfigService)
        .to(config_service_1.ConfigService)
        .inSingletonScope();
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        const appContainer = new inversify_1.Container();
        appContainer.load(exports.appBindings);
        const app = appContainer.get(service_identifiers_consts_1.SERVICE_IDENTIFIER.Application);
        yield app.init().catch((error) => {
            console.error("Error during initialization:", error);
            app.close();
        });
        return { appContainer, app };
    });
}
exports.default = bootstrap;
