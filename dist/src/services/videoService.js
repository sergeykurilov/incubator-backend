"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoById = exports.deleteAllVideos = exports.createVideo = exports.findVideoById = exports.deleteVideoById = exports.findAllVideos = void 0;
const db_1 = require("../repositories/video/db");
const findAllVideos = () => {
    return db_1.videos;
};
exports.findAllVideos = findAllVideos;
const deleteVideoById = (id) => {
    const index = db_1.videos.findIndex((v) => v.id === id);
    if (index !== -1) {
        db_1.videos.splice(index, 1);
        return true;
    }
    return false;
};
exports.deleteVideoById = deleteVideoById;
const findVideoById = (id) => {
    return db_1.videos.find((v) => v.id === id);
};
exports.findVideoById = findVideoById;
const createVideo = (videoData) => {
    const newVideo = Object.assign(Object.assign({}, videoData), { id: new Date().valueOf(), createdAt: new Date().toISOString(), publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() });
    db_1.videos.push(newVideo);
    return newVideo;
};
exports.createVideo = createVideo;
const deleteAllVideos = () => {
    db_1.videos.length = 0;
};
exports.deleteAllVideos = deleteAllVideos;
const updateVideoById = (id, videoData) => {
    const index = db_1.videos.findIndex((v) => v.id === id);
    if (index !== -1) {
        const updatedVideo = Object.assign(Object.assign({}, db_1.videos[index]), videoData);
        db_1.videos[index] = updatedVideo;
        return updatedVideo;
    }
    return false;
};
exports.updateVideoById = updateVideoById;
