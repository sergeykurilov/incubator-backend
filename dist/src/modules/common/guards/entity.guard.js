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
exports.EntityGuard = void 0;
const http_status_codes_interface_1 = require("../interfaces/http-status-codes.interface");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class EntityGuard {
    constructor(dtoClass) {
        this.dtoClass = dtoClass;
    }
    execute(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtoInstance = (0, class_transformer_1.plainToInstance)(this.dtoClass, req.body);
            const errors = yield (0, class_validator_1.validate)(dtoInstance);
            if (errors.length > 0) {
                const errorMessages = errors.map((err) => ({
                    field: err.property,
                    message: Object.values(err.constraints).join(", "),
                }));
                const apiErrorResult = {
                    errorsMessages: errorMessages,
                };
                return res.status(http_status_codes_interface_1.HttpStatusCodes.BAD_REQUEST).json(apiErrorResult);
            }
            return next();
        });
    }
}
exports.EntityGuard = EntityGuard;
