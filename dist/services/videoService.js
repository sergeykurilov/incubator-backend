"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoById = exports.deleteAllVideos = exports.createVideo = exports.findVideoById = exports.deleteVideoById = exports.findAllVideos = void 0;
const settings_1 = require("../settings");
const validationService_1 = require("./validationService");
const findAllVideos = () => {
    return settings_1.videos;
};
exports.findAllVideos = findAllVideos;
const deleteVideoById = (id) => {
    const index = settings_1.videos.findIndex((v) => v.id === id);
    if (index !== -1) {
        settings_1.videos.splice(index, 1);
        return true;
    }
    return false;
};
exports.deleteVideoById = deleteVideoById;
const findVideoById = (id) => {
    return settings_1.videos.find((v) => v.id === id);
};
exports.findVideoById = findVideoById;
const createVideo = (videoData) => {
    const newVideo = Object.assign(Object.assign({}, videoData), { id: new Date().valueOf(), createdAt: new Date().toISOString(), publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() });
    settings_1.videos.push(newVideo);
    return newVideo;
};
exports.createVideo = createVideo;
const deleteAllVideos = () => {
    settings_1.videos.length = 0;
};
exports.deleteAllVideos = deleteAllVideos;
const updateVideoById = (videos, id, videoData) => {
    const existingVideo = videos.find((v) => v.id === id);
    if (!existingVideo) {
        return {
            error: {
                errorMessages: [
                    { message: "existingVideo not found", field: "existingVideo" },
                ],
            },
        };
    }
    const validationErrors = (0, validationService_1.validateVideoInput)(videoData);
    if (validationErrors) {
        return {
            error: {
                errorMessages: [
                    { message: "existingVideo not found", field: "existingVideo" },
                ],
            },
        };
    }
    const updatedVideo = Object.assign(Object.assign({}, existingVideo), videoData);
    const updatedIndex = videos.findIndex((v) => v.id === id);
    if (updatedIndex !== -1) {
        videos[updatedIndex] = updatedVideo;
        return { success: true };
    }
    else {
        return {
            error: {
                errorMessages: [
                    { message: "video wasn't been updated", field: "updatedVideo" },
                ],
            },
        };
    }
};
exports.updateVideoById = updateVideoById;
