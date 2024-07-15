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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
const inversify_1 = require("inversify");
const service_identifiers_consts_1 = require("../modules/common/consts/service-identifiers.consts");
let ConfigService = class ConfigService {
    constructor(logger) {
        this.logger = logger;
        const result = (0, dotenv_1.config)();
        if (result.error) {
            this.logger.error("[ConfigService] Cannot read file .env or it doesnt exist");
        }
        else {
            this.logger.log("[ConfigService] config .env loaded");
            this.config = result.parsed;
        }
    }
    get(key) {
        return this.config[key];
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.ILogger)),
    __metadata("design:paramtypes", [Object])
], ConfigService);
