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
exports.BlogService = void 0;
const inversify_1 = require("inversify");
const service_identifiers_consts_1 = require("../../common/consts/service-identifiers.consts");
const http_error_1 = require("../../common/exceptions/http-error");
const http_status_codes_interface_1 = require("../../common/interfaces/http-status-codes.interface");
let BlogService = class BlogService {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }
    findAll() {
        return this.blogRepository.findAll();
    }
    create(createBlogDto) {
        return this.blogRepository.create(createBlogDto);
    }
    deleteAll() {
        return this.blogRepository.deleteAll();
    }
    update(id, createBlogDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogRepository.findById(id);
            if (!id) {
                throw new http_error_1.HTTPError(http_status_codes_interface_1.HttpStatusCodes.NOT_FOUND, "Not Found", "id");
            }
            if (!createBlogDto) {
                throw new http_error_1.HTTPError(http_status_codes_interface_1.HttpStatusCodes.NOT_FOUND, "Not Found");
            }
            return this.blogRepository.update(id, createBlogDto);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogRepository.findById(id);
            if (!blog || !blog.id) {
                throw new http_error_1.HTTPError(http_status_codes_interface_1.HttpStatusCodes.NOT_FOUND, "Not Found", "id");
            }
            return blog;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogRepository.deleteById(id);
            if (!blog) {
                throw new http_error_1.HTTPError(http_status_codes_interface_1.HttpStatusCodes.NOT_FOUND, "Not Found", "id");
            }
            return blog;
        });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.BlogRepository)),
    __metadata("design:paramtypes", [Object])
], BlogService);
