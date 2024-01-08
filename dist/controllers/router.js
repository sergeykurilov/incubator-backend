"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoRoutes_1 = __importDefault(require("./video/videoRoutes"));
const router = (0, express_1.Router)();
router.use("/videos", videoRoutes_1.default);
exports.default = router;
