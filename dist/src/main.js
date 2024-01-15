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
Object.defineProperty(exports, "__esModule", { value: true });
exports.boot = exports.appBindings = void 0;
const inversify_1 = require("inversify");
const app_1 = require("./app");
const logger_service_1 = require("../common/logger/logger.service");
const service_identifiers_1 = require("../common/consts/service-identifiers");
const exception_filter_1 = require("../common/exceptions/exception.filter");
const video_repository_1 = require("./repositories/video/video.repository");
const video_service_1 = require("./services/video/video.service");
const video_controller_1 = require("./controllers/video/video.controller");
exports.appBindings = new inversify_1.ContainerModule((bind) => {
    bind(service_identifiers_1.SERVICE_IDENTIFIER.ILogger)
        .to(logger_service_1.LoggerService)
        .inSingletonScope();
    bind(service_identifiers_1.SERVICE_IDENTIFIER.ExceptionFilter)
        .to(exception_filter_1.ExceptionFilter)
        .inSingletonScope();
    bind(service_identifiers_1.SERVICE_IDENTIFIER.Application).to(app_1.App).inSingletonScope();
    bind(service_identifiers_1.SERVICE_IDENTIFIER.VideoService)
        .to(video_service_1.VideoService)
        .inSingletonScope();
    bind(service_identifiers_1.SERVICE_IDENTIFIER.VideoController)
        .to(video_controller_1.VideoController)
        .inSingletonScope();
    bind(service_identifiers_1.SERVICE_IDENTIFIER.VideoRepository)
        .to(video_repository_1.VideoRepository)
        .inSingletonScope();
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const appContainer = new inversify_1.Container();
        appContainer.load(exports.appBindings);
        const app = appContainer.get(service_identifiers_1.SERVICE_IDENTIFIER.Application);
        yield app.init().catch((error) => {
            console.error("Error during initialization:", error);
        });
        return { appContainer, app };
    });
}
exports.boot = bootstrap();
