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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const base_controller_1 = require("../../../common/controllers/base.controller");
const inversify_1 = require("inversify");
const service_identifiers_1 = require("../../../common/consts/service-identifiers");
require("reflect-metadata");
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
                const videos = yield this.videoService.deleteAll();
                res.status(201);
            }
            catch (error) {
                this.loggerService.error("Error getting all videos", error);
                next(error);
            }
        });
    }
    getById({ params: { id } }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const video = this.videoService.findById(+id);
            if (!video) {
                res.sendStatus(404);
            }
            else {
                yield this.videoService.deleteById(+id);
                res.sendStatus(204);
            }
        });
    }
    deleteById({ params: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const video = yield this.videoService.deleteById(+id);
            if (!video) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videoCreationResult = yield this.videoService.createVideo(req.body);
                if (Array.isArray(videoCreationResult)) {
                    res.status(400).json({ errors: videoCreationResult });
                }
                res.status(201).json(videoCreationResult);
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
                const id = parseInt(req.params.id);
                const success = yield this.videoService.deleteById(id);
                if (!success) {
                    res.status(404).send("Video not found");
                }
                res.status(204).send();
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
                const updatedVideo = yield this.videoService.updateVideo(id, req.body);
                if (Array.isArray(updatedVideo)) {
                    res.status(400).json({ errors: updatedVideo });
                }
                if (!updatedVideo) {
                    res.status(404).send("Video not found");
                }
                res.json(updatedVideo);
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
    __param(0, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.VideoService)),
    __param(1, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.ILogger))
], VideoController);
