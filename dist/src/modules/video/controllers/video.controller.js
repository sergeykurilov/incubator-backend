"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const video_service_1 = require("../services/video.service");
const base_controller_1 = require("../../common/controllers/base.controller");
const service_identifiers_consts_1 = require("../../common/consts/service-identifiers.consts");
const logger_service_1 = require("../../common/logger/logger.service");
const http_status_codes_interface_1 = require("../../common/interfaces/http-status-codes.interface");
let VideoController = class VideoController extends base_controller_1.BaseController {
    constructor(videoService, loggerService) {
        super(loggerService);
        this.videoService = videoService;
        this.loggerService = loggerService;
        this.bindRoutes([
            {
                path: "/",
                method: "get" /* HTTPMethods.GET */,
                func: this.getAll,
            },
            {
                path: "/:id",
                method: "get" /* HTTPMethods.GET */,
                func: this.getById,
            },
            {
                path: "/",
                method: "post" /* HTTPMethods.POST */,
                func: this.create,
            },
            {
                path: "/:id",
                method: "put" /* HTTPMethods.PUT */,
                func: this.update,
            },
            {
                path: "/:id",
                method: "delete" /* HTTPMethods.DELETE */,
                func: this.deleteById,
            },
            {
                path: "/",
                method: "delete" /* HTTPMethods.DELETE */,
                func: this.delete,
            },
        ]);
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videos = yield this.videoService.findAll();
                res.json(videos);
            }
            catch (error) {
                this.loggerService.error("Error getting all videos", error);
                next(error);
            }
        });
    }
    deleteAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.videoService.deleteAll();
                res.status(http_status_codes_interface_1.HttpStatusCodes.CREATED);
            }
            catch (error) {
                this.loggerService.error("Error getting all videos", error);
                next(error);
            }
        });
    }
    getById({ params: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const video = yield this.videoService.findById(+id);
            if (!(video === null || video === void 0 ? void 0 : video.id)) {
                res.status(http_status_codes_interface_1.HttpStatusCodes.NOT_FOUND).send();
                return;
            }
            res.status(http_status_codes_interface_1.HttpStatusCodes.OK).json(video);
        });
    }
    deleteById({ params: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const video = yield this.videoService.deleteById(+id);
            if (!video) {
                res.sendStatus(http_status_codes_interface_1.HttpStatusCodes.NOT_FOUND);
            }
            else {
                res.sendStatus(http_status_codes_interface_1.HttpStatusCodes.NO_CONTENT);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { video: createdVideo, errors } = yield this.videoService.createVideo(req.body);
                const errorMessage = {
                    errorsMessages: errors,
                };
                if (errors.length > 0) {
                    res.status(http_status_codes_interface_1.HttpStatusCodes.BAD_REQUEST).json(errorMessage);
                }
                res.status(http_status_codes_interface_1.HttpStatusCodes.CREATED).json(createdVideo);
            }
            catch (error) {
                this.loggerService.error("Error while creating video", error);
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.videoService.deleteAll();
                res.status(http_status_codes_interface_1.HttpStatusCodes.NO_CONTENT).send();
            }
            catch (error) {
                this.loggerService.error("Error while deleting video", error);
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { errors, video: updatedVideo, isVideo, } = yield this.videoService.updateVideo(id, req.body);
                const errorMessage = {
                    errorsMessages: errors,
                };
                // TODO: improve error handling
                if (!isVideo) {
                    res.status(http_status_codes_interface_1.HttpStatusCodes.NOT_FOUND).send("Video not found");
                }
                if (errors.length > 0) {
                    res.status(http_status_codes_interface_1.HttpStatusCodes.BAD_REQUEST).json(errorMessage);
                }
                res.status(http_status_codes_interface_1.HttpStatusCodes.NO_CONTENT).json(updatedVideo);
            }
            catch (error) {
                this.loggerService.error("Error while updating video", error);
                next(error);
            }
        });
    }
};
exports.VideoController = VideoController;
exports.VideoController = VideoController = __decorate([
    __param(0, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.VideoService)),
    __param(1, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.ILogger)),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        logger_service_1.LoggerService])
], VideoController);
