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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBService = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importDefault(require("mongoose"));
const service_identifiers_consts_1 = require("../modules/common/consts/service-identifiers.consts");
let MongoDBService = class MongoDBService {
    constructor(logger, configService) {
        this.logger = logger;
        this.configService = configService;
        this.mongooseInstance = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.mongooseInstance) {
                    const uri = "mongodb+srv://user_001:q92e01klsd14@cluster0.ak8nd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
                    if (!uri) {
                        throw new Error("MONGODB_URI is not defined in config.");
                    }
                    this.mongooseInstance = yield mongoose_1.default.connect(uri, {
                        bufferCommands: false,
                        autoIndex: true,
                        autoCreate: true,
                        serverApi: {
                            version: "1",
                            strict: true,
                            deprecationErrors: true,
                        },
                    });
                    this.logger.log("[MongoDBService] Successfully connected to MongoDB.");
                }
                else {
                    this.logger.log("[MongoDBService] Already connected to MongoDB.");
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    this.logger.error("[MongoDBService] Error connecting to MongoDB: " + e.message);
                }
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongooseInstance) {
                yield this.mongooseInstance.disconnect();
                this.logger.log("[MongoDBService] Disconnected from MongoDB.");
            }
        });
    }
    getMongooseInstance() {
        return this.mongooseInstance || {};
    }
};
exports.MongoDBService = MongoDBService;
exports.MongoDBService = MongoDBService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.ILogger)),
    __param(1, (0, inversify_1.inject)(service_identifiers_consts_1.SERVICE_IDENTIFIER.ConfigService)),
    __metadata("design:paramtypes", [Object, Object])
], MongoDBService);
