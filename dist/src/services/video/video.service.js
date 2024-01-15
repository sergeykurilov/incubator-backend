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
exports.VideoService = void 0;
const inversify_1 = require("inversify");
const service_identifiers_1 = require("../../../common/consts/service-identifiers");
const video_validation_1 = require("./video.validation");
let VideoService = class VideoService {
    constructor(videoRepository) {
        this.videoRepository = videoRepository;
    }
    createVideo(videoDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = video_validation_1.VideoValidator.validateCreateVideo(videoDto);
                if (errors.length) {
                    return errors;
                }
                return yield this.videoRepository.create(videoDto);
            }
            catch (error) {
                throw new Error(`Error while creating video`);
            }
        });
    }
    deleteAll() {
        try {
            return this.videoRepository.deleteAll();
        }
        catch (e) {
            throw new Error(`Error while deleting videos`);
        }
    }
    deleteById(id) {
        try {
            return this.videoRepository.deleteById(id);
        }
        catch (e) {
            throw new Error(`Error while deleting videos`);
        }
    }
    findAll() {
        try {
            return this.videoRepository.findAll();
        }
        catch (e) {
            throw new Error(`Error while searching for videos`);
        }
    }
    findById(id) {
        try {
            return this.videoRepository.findById(id);
        }
        catch (e) {
            throw new Error(`Error while searching for videos`);
        }
    }
    updateVideo(id, updatedVideo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = video_validation_1.VideoValidator.validateUpdateVideo(updatedVideo);
                if (errors.length) {
                    return errors;
                }
                return yield this.videoRepository.update(id, updatedVideo);
            }
            catch (error) {
                throw new Error(`Error while updating video`);
            }
        });
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.VideoRepository))
], VideoService);
