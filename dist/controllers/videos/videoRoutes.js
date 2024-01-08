"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_1 = require("../../settings");
const router = (0, express_1.Router)();
const validateVideoInput = (reqBody) => {
    const errors = { errorMessages: [] };
    const { title, author, availableResolutions } = reqBody;
    if (!title || typeof title !== "string" || title.trim().length > 40) {
        errors.errorMessages.push({
            field: "title",
            message: "Incorrect Title",
        });
    }
    if (!author || typeof author !== "string" || author.trim().length > 20) {
        errors.errorMessages.push({
            field: "author",
            message: "Incorrect Author",
        });
    }
    if (!Array.isArray(availableResolutions)) {
        errors.errorMessages.push({
            field: "availableResolutions",
            message: "Incorrect availableResolutions",
        });
    }
    else {
        availableResolutions.forEach((resolution) => {
            if (!settings_1.AvailableResolution[resolution]) {
                errors.errorMessages.push({
                    field: "availableResolutions",
                    message: "Invalid availableResolutions value",
                });
            }
        });
    }
    return errors.errorMessages.length ? errors : null;
};
router.get("/", (req, res) => {
    res.send(settings_1.videos);
});
router.get("/:id", (req, res) => {
    const id = +req.params.id;
    const video = settings_1.videos.find((v) => v.id === id);
    if (!video) {
        res.sendStatus(404);
    }
    else {
        res.send(video);
    }
});
router.post("/", (req, res) => {
    const validationErrors = validateVideoInput(req.body);
    if (validationErrors) {
        res.status(400).json(validationErrors);
    }
    else {
        const createdAt = new Date();
        const publishedAt = new Date();
        publishedAt.setDate(createdAt.getDate() + 1);
        const newVideo = Object.assign({ id: new Date().valueOf(), canBeDownloaded: false, minAgeRestriction: null, createdAt: createdAt.toISOString(), publicationDate: publishedAt.toISOString() }, req.body);
        settings_1.videos.push(newVideo);
        res.status(201).json(newVideo);
    }
});
router.delete("/testing/all-data", (req, res) => {
    settings_1.videos.length = 0;
    res.sendStatus(204);
});
exports.default = router;
