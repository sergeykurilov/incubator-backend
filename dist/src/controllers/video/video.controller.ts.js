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
exports.VideoController = void 0;
const express_1 = require("express");
const videoService = __importStar(require("../../services/videoService"));
const validationService_1 = require("../../services/validationService");
const base_controller_1 = require("../../../common/controllers/base.controller");
const { parseISO, isValid } = require("date-fns"); // date-fns library for date validation
class VideoController extends base_controller_1.BaseController {
}
exports.VideoController = VideoController;
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
        res.status(400).json({ errorsMessages: validationErrors.errorMessages });
    }
    else {
        const newVideo = videoService.createVideo(Object.assign(Object.assign({}, req.body), { canBeDownloaded: false, minAgeRestriction: null }));
        res.status(201).json(newVideo);
    }
});
router.put("/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ errorsMessages: [{ message: "Invalid ID", field: "id" }] });
        }
        const videoToUpdate = videoService.findVideoById(id);
        if (!videoToUpdate) {
            return res.sendStatus(404);
        }
        const { title, author, availableResolutions, canBeDownloaded = false, minAgeRestriction, publicationDate, } = req.body;
        const validationErrors = [];
        // Title validation
        if (!title || typeof title !== "string" || title.trim().length > 40) {
            validationErrors.push({ field: "title", message: "Incorrect Title" });
        }
        // Author validation
        if (!author || typeof author !== "string" || author.trim().length > 20) {
            validationErrors.push({ field: "author", message: "Incorrect Author" });
        }
        // Available Resolutions validation
        if (availableResolutions && !Array.isArray(availableResolutions)) {
            validationErrors.push({
                field: "availableResolutions",
                message: "Incorrect availableResolutions",
            });
        }
        // canBeDownloaded validation
        if (typeof canBeDownloaded !== "boolean") {
            validationErrors.push({
                field: "canBeDownloaded",
                message: "canBeDownloaded must be a boolean",
            });
        }
        // Min Age Restriction validation
        if (minAgeRestriction !== undefined && minAgeRestriction !== null) {
            if (typeof minAgeRestriction !== "number" ||
                minAgeRestriction < 1 ||
                minAgeRestriction > 18) {
                validationErrors.push({
                    field: "minAgeRestriction",
                    message: "minAgeRestriction must be a number between 1 and 18 (inclusive)",
                });
            }
        }
        // Publication Date validation
        if (publicationDate !== undefined && publicationDate !== null) {
            // Check if publicationDate is a string and a valid ISO 8601 date
            if (typeof publicationDate !== "string" ||
                !isValid(parseISO(publicationDate))) {
                validationErrors.push({
                    field: "publicationDate",
                    message: "publicationDate must be a valid ISO 8601 date",
                });
            }
        }
        // Check if any validation errors exist
        if (validationErrors.length > 0) {
            return res.status(400).json({ errorsMessages: validationErrors });
        }
        // Update video logic
        const success = videoService.updateVideoById(id, req.body);
        if (success) {
            return res.sendStatus(204);
        }
        else {
            return res.status(400).json({
                errorsMessages: [{ message: "Update failed", field: "videoData" }],
            });
        }
    }
    catch (error) {
        console.error("Error in PUT /videos/:id", error); // Logging the error
        return res.status(500).json({ message: "Internal Server Error 1" });
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
exports.default = router;
