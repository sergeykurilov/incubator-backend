"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const db_1 = require("./db");
require("reflect-metadata");
const inversify_1 = require("inversify");
const addDays_1 = require("date-fns/addDays");
let VideoRepository = class VideoRepository {
    create(video) {
        return new Promise((resolve) => {
            const newId = db_1.videos.length > 0 ? Math.max(...db_1.videos.map((v) => v.id)) + 1 : 1;
            const newVideo = Object.assign(Object.assign({ id: newId }, video), { canBeDownloaded: false, minAgeRestriction: null, createdAt: new Date().toISOString(), publicationDate: (0, addDays_1.addDays)(new Date(), 1).toISOString() });
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
};
exports.VideoRepository = VideoRepository;
exports.VideoRepository = VideoRepository = __decorate([
    (0, inversify_1.injectable)()
], VideoRepository);
