"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const db_1 = require("./db");
require("reflect-metadata");
class VideoRepository {
    create(video) {
        return new Promise((resolve) => {
            const newId = db_1.videos.length > 0 ? Math.max(...db_1.videos.map((v) => v.id)) + 1 : 1;
            const newVideo = Object.assign(Object.assign({}, video), { id: newId });
            db_1.videos.push(newVideo);
            resolve(newVideo);
        });
    }
    update(id, updatedVideo) {
        return new Promise((resolve) => {
            const videoIndex = db_1.videos.findIndex((video) => video.id === id);
            if (videoIndex === -1) {
                resolve(null);
            }
            else {
                db_1.videos[videoIndex] = Object.assign(Object.assign({}, db_1.videos[videoIndex]), updatedVideo);
                resolve(db_1.videos[videoIndex]);
            }
        });
    }
    deleteById(id) {
        return new Promise((resolve) => {
            const videoIndex = db_1.videos.findIndex((video) => video.id === id);
            if (videoIndex === -1) {
                resolve(false);
            }
            else {
                db_1.videos.splice(videoIndex, 1);
                resolve(true);
            }
        });
    }
    deleteAll() {
        return new Promise((resolve) => {
            db_1.videos.length = 0;
            resolve();
        });
    }
    findAll() {
        return new Promise((resolve) => {
            return resolve(db_1.videos);
        });
    }
    findById(id) {
        return new Promise((resolve) => {
            const video = db_1.videos.find((video) => video.id === id);
            if (video) {
                resolve(video);
            }
            else {
                resolve(null);
            }
        });
    }
}
exports.VideoRepository = VideoRepository;
