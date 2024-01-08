"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoService = __importStar(require("../../services/videoService"));
const validationService_1 = require("../../services/validationService");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const videos = videoService.findAllVideos();
    res.send(videos);
});
router.get("/:id", (req, res) => {
    const id = +req.params.id;
    const video = videoService.findVideoById(id);
    if (!video) {
        res.sendStatus(404);
    }
    else {
        res.send(video);
    }
});
router.post("/", (req, res) => {
    const validationErrors = (0, validationService_1.validateVideoInput)(req.body);
    if (validationErrors) {
        res.status(400).json(validationErrors);
    }
    else {
        const newVideo = videoService.createVideo(Object.assign(Object.assign({}, req.body), { canBeDownloaded: false, minAgeRestriction: null }));
        res.status(201).json(newVideo);
    }
});
router.put("/:id", (req, res) => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
        return res
            .status(400)
            .send({ errorsMessages: [{ message: "Invalid ID", field: "id" }] });
    }
    const videoToUpdate = videoService.findVideoById(id);
    if (!videoToUpdate) {
        return res.sendStatus(404);
    }
    const validationErrors = (0, validationService_1.validateVideoInput)(req.body);
    if (validationErrors) {
        return res.status(400).json(validationErrors);
    }
    const success = videoService.updateVideoById(id, req.body);
    if (success) {
        return res.sendStatus(204);
    }
    else {
        return res.status(400).send({
            errorsMessages: [{ message: "Update failed", field: "videoData" }],
        });
    }
});
router.delete("/:id", (req, res) => {
    const id = +req.params.id;
    const video = videoService.findVideoById(id);
    if (!video) {
        res.sendStatus(404);
    }
    else {
        videoService.deleteVideoById(id);
        res.sendStatus(204);
    }
});
router.delete("/", (req, res) => {
    videoService.deleteAllVideos();
    res.sendStatus(204);
});
exports.default = router;
