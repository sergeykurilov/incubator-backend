"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllVideos = exports.createVideo = exports.findVideoById = exports.findAllVideos = void 0;
const settings_1 = require("../settings");
const findAllVideos = () => {
    return settings_1.videos;
};
exports.findAllVideos = findAllVideos;
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
