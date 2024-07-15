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
exports.PostController = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const post_service_1 = require("../services/post.service");
const base_controller_1 = require("../../common/controllers/base.controller");
const service_identifiers_consts_1 = require("../../common/consts/service-identifiers.consts");
const http_status_codes_interface_1 = require("../../common/interfaces/http-status-codes.interface");
const logger_service_1 = require("../../common/logger/logger.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const entity_guard_1 = require("../../common/guards/entity.guard");
const post_dto_1 = require("./dto/post.dto");
let PostController = class PostController extends base_controller_1.BaseController {
    constructor(postService, loggerService) {
        super(loggerService);
        this.postService = postService;
        this.loggerService = loggerService;
        this.bindRoutes([
            {
                path: "/",
                method: "get" /* HTTPMethods.GET */,
                func: this.getAll,
            },
            {
                path: "/",
                method: "post" /* HTTPMethods.POST */,
                func: this.create,
                middlewares: [new auth_guard_1.AuthGuard(), new entity_guard_1.EntityGuard(post_dto_1.PostDto)],
            },
            {
                path: "/:id",
                method: "put" /* HTTPMethods.PUT */,
                func: this.update,
                middlewares: [new auth_guard_1.AuthGuard(), new entity_guard_1.EntityGuard(post_dto_1.PostDto)],
            },
            {
                path: "/:id",
                method: "get" /* HTTPMethods.GET */,
                func: this.getById,
            },
            {
                path: "/:id",
                method: "delete" /* HTTPMethods.DELETE */,
                func: this.deleteById,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
        ]);
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield this.postService.findAll();
                res.json(blogs);
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postService.create(req.body);
                this.created(res);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postService.update(String(req.params.id), req.body);
                this.created(res);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield this.postService.findById(String(req.params.id));
                res.status(http_status_codes_interface_1.HttpStatusCodes.OK).json(blog);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const video = yield this.postService.deleteById(String(id));
                res.status(http_status_codes_interface_1.HttpStatusCodes.OK).json(video);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postService.deleteAll();
                res.status(http_status_codes_interface_1.HttpStatusCodes.OK);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.PostController = PostController;
exports.PostController = PostController = __decorate([
    __param(0, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.BlogService)),
    __param(1, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.ILogger)),
    __metadata("design:paramtypes", [post_service_1.PostService,
        logger_service_1.LoggerService])
], PostController);
