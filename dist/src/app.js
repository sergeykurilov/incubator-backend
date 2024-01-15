"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const inversify_1 = require("inversify");
const service_identifiers_1 = require("../common/consts/service-identifiers");
let App = class App {
    constructor(logger, videoController, videoService, exceptionFilter) {
        this.logger = logger;
        this.videoController = videoController;
        this.videoService = videoService;
        this.exceptionFilter = exceptionFilter;
        this.app = (0, express_1.default)();
        this.port = 8000;
    }
    useMiddleware() {
        this.app.use(express_1.default.json());
    }
    useRoutes() {
        this.app.use("/users", this.videoController.router);
        this.app.delete("/testing/all-data", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.videoService.deleteAll();
                res.sendStatus(204);
            }
            catch (error) {
                next(error);
            }
        }));
    }
    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useMiddleware();
            this.useRoutes();
            this.useExceptionFilters();
            this.server = this.app.listen(this.port);
            this.logger.log(`Server running on http://localhost:${this.port}`);
        });
    }
    close() {
        this.server.close();
    }
};
exports.App = App;
exports.App = App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.ILogger)),
    __param(1, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.VideoController)),
    __param(2, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.VideoService)),
    __param(3, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.ExceptionFilter))
], App);
