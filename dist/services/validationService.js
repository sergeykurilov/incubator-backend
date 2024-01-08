"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVideoInput = void 0;
const videos_1 = require("../types/videos");
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
            if (!videos_1.AvailableResolution[resolution]) {
                errors.errorMessages.push({
                    field: "availableResolutions",
                    message: "Invalid availableResolutions value",
                });
            }
        });
    }
    return errors.errorMessages.length ? errors : null;
};
exports.validateVideoInput = validateVideoInput;
