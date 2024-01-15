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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionFilter = void 0;
const inversify_1 = require("inversify");
const http_error_1 = require("./http-error");
require("reflect-metadata");
const service_identifiers_1 = require("../consts/service-identifiers");
let ExceptionFilter = class ExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(err, req, res, next) {
        if (err instanceof http_error_1.HTTPError) {
            this.logger.error(`[${err.context}]: Error ${err.statusCode}: ${err.message}`);
            res.status(err.statusCode).send({ err: err.message });
        }
        else {
            this.logger.error(`${err.message}`);
            res.status(500).send({ err: err.message });
        }
    }
};
exports.ExceptionFilter = ExceptionFilter;
exports.ExceptionFilter = ExceptionFilter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_identifiers_1.SERVICE_IDENTIFIER.ILogger))
], ExceptionFilter);
