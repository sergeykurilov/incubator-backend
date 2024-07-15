"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("../src/main"));
const videos_1 = require("../src/modules/video/entity/videos");
const service_identifiers_consts_1 = require("../src/modules/common/consts/service-identifiers.consts");
const request = require("supertest");
const sampleVideo = {
    title: "Sample Video",
    author: "Test Author",
    availableResolutions: ["P144"],
};
describe("Video API Routes", () => {
    let application;
    let videoRepository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const bootstrap = yield (0, main_1.default)();
        application = bootstrap.app.app;
        videoRepository = bootstrap.appContainer.get(service_identifiers_consts_1.SERVICE_IDENTIFIER.VideoRepository);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield videoRepository.deleteAll();
    }));
    it("PUT /videos/:id should return error for invalid publicationDate", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield videoRepository.create(sampleVideo);
        const invalidData = {
            author: "length_20-weqweqweqw",
            title: "valid title",
            availableResolutions: ["P240", "P720"],
            canBeDownloaded: true,
            minAgeRestriction: 15,
            publicationDate: "1995", // Invalid publicationDate
        };
        const response = yield request(application)
            .put(`/videos/${createdVideo.id}`)
            .send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages).toEqual([
            {
                field: "publicationDate",
                message: "publicationDate must be a valid ISO 8601 date",
            },
        ]);
        const unchangedVideo = yield videoRepository.findById(createdVideo.id);
        expect(unchangedVideo === null || unchangedVideo === void 0 ? void 0 : unchangedVideo.title).toBe(sampleVideo.title);
    }));
    it("PUT /videos/:id should return error messages for invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield videoRepository.create(sampleVideo);
        const invalidData = {
            author: "length_21-weqweqweqwq",
            title: "valid title",
            availableResolutions: ["P240", "P720"],
            canBeDownloaded: "string",
            minAgeRestriction: 15,
            publicationDate: "1995",
        };
        const response = yield request(application)
            .put(`/videos/${createdVideo.id}`)
            .send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages).toEqual([
            {
                field: "publicationDate",
                message: "publicationDate must be a valid ISO 8601 date",
            },
            {
                field: "canBeDownloaded",
                message: "canBeDownloaded must be a boolean",
            },
            {
                field: "author",
                message: "Incorrect author",
            },
        ]);
        const unchangedVideo = yield videoRepository.findById(createdVideo.id);
        expect(unchangedVideo === null || unchangedVideo === void 0 ? void 0 : unchangedVideo.title).toBe(sampleVideo.title);
    }));
    it("PUT, DELETE, GET /videos/:id should return a 404 status when the video ID is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentVideoId = 9999;
        const putResponse = yield request(application)
            .put(`/videos/${nonExistentVideoId}`)
            .send({ title: "Updated Title" });
        const deleteResponse = yield request(application).delete(`/videos/${nonExistentVideoId}`);
        const getResponse = yield request(application).get(`/videos/${nonExistentVideoId}`);
        expect(deleteResponse.status).toBe(404);
        expect(getResponse.status).toBe(404);
        expect(putResponse.status).toBe(404);
    }));
    it("PUT /videos should return error for incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield videoRepository.create(sampleVideo);
        const invalidData = {
            title: null,
            author: "valid author",
            availableResolutions: ["P144", "P240", "P720"],
            canBeDownloaded: "string",
            minAgeRestriction: 17,
            publicationDate: "2024-01-19T15:25:28.880Z",
        };
        const response = yield request(application)
            .put(`/videos/${createdVideo.id}`)
            .send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages).toEqual([
            {
                field: "title",
                message: "Incorrect title",
            },
            {
                field: "canBeDownloaded",
                message: "canBeDownloaded must be a boolean",
            },
        ]);
        const unchangedVideo = yield videoRepository.findById(createdVideo.id);
        expect(unchangedVideo === null || unchangedVideo === void 0 ? void 0 : unchangedVideo.title).toBe(sampleVideo.title);
    }));
    it("DELETE /videos/:id should return 404 when video is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidVideoId = 999;
        const response = yield request(application)
            .delete(`/videos/${invalidVideoId}`)
            .send();
        expect(response.status).toBe(404);
    }));
    it("GET /videos should return a list of videos", () => __awaiter(void 0, void 0, void 0, function* () {
        yield videoRepository.create(sampleVideo);
        const response = yield request(application).get("/videos");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    }));
    it("GET /videos/:id should return a single video by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield videoRepository.create(sampleVideo);
        const response = yield request(application).get(`/videos/${createdVideo.id}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdVideo.id);
    }));
    it("DELETE /videos/:id should return a 404 error with invalid video ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidVideoId = 999;
        const updatedData = {
            title: "Updated Title",
            author: "Updated Author",
            canBeDownloaded: true,
            minAgeRestriction: 18,
            availableResolutions: ["P144"],
        };
        const response = yield request(application)
            .put(`/videos/${invalidVideoId}`)
            .send(updatedData);
        expect(response.status).toBe(404);
    }));
    it("GET /videos should return a list of videos with defined values", () => __awaiter(void 0, void 0, void 0, function* () {
        yield videoRepository.create(sampleVideo);
        const response = yield request(application).get("/videos");
        expect(response.status).toBe(200);
        expect(response.body.every((video) => video.createdAt)).toBe(true);
        console.log(response.body);
        expect(response.body.every((video) => video.publicationDate)).toBe(true);
    }));
    it("POST /videos should create a new video", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(application)
            .post("/videos")
            .send(sampleVideo);
        console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(sampleVideo.title);
        const createdVideo = yield videoRepository.findById(response.body.id);
        expect(createdVideo).toBeTruthy();
    }));
    it("PUT /videos/:id should update an existing video with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield videoRepository.create(sampleVideo);
        const updatedData = {
            title: "Updated Title",
            author: "Updated Author",
            canBeDownloaded: true,
            minAgeRestriction: 18,
            availableResolutions: ["P144"],
        };
        const response = yield request(application)
            .put(`/videos/${createdVideo.id}`)
            .send(updatedData);
        expect(response.status).toBe(204);
        const updatedVideo = yield videoRepository.findById(createdVideo.id);
        expect(updatedVideo === null || updatedVideo === void 0 ? void 0 : updatedVideo.title).toBe(updatedData.title);
    }));
    it("PUT /videos/:id should return a 404 error with invalid video ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidVideoId = 999;
        const updatedData = {
            title: "Updated Title",
            author: "Updated Author",
            canBeDownloaded: true,
            minAgeRestriction: 18,
            availableResolutions: ["P144"],
        };
        const response = yield request(application)
            .put(`/videos/${invalidVideoId}`)
            .send(updatedData);
        expect(response.status).toBe(404);
    }));
    it("PUT /videos/:id should return a 400 error with invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield videoRepository.create(sampleVideo);
        const invalidData = {
            author: "length_21-weqweqweqwq",
            title: "valid title",
            availableResolutions: ["P240", "P720"],
            canBeDownloaded: true,
            minAgeRestriction: 15,
            publicationDate: 1995,
        };
        const response = yield request(application)
            .put(`/videos/${createdVideo.id}`)
            .send(invalidData);
        expect(response.status).toBe(400);
        console.log(response.body);
        expect(response.body.errorsMessages).toEqual([
            {
                field: "publicationDate",
                message: "publicationDate must be a valid ISO 8601 date",
            },
            {
                field: "author",
                message: "Incorrect author",
            },
        ]);
        const unchangedVideo = yield videoRepository.findById(createdVideo.id);
        expect(unchangedVideo === null || unchangedVideo === void 0 ? void 0 : unchangedVideo.title).toBe(sampleVideo.title);
    }));
    it("DELETE /videos/:id should delete an existing video", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield videoRepository.create(sampleVideo);
        const response = yield request(application).delete(`/videos/${createdVideo.id}`);
        expect(response.status).toBe(204);
        const deletedVideo = yield videoRepository.findById(createdVideo.id);
        expect(deletedVideo).toBeNull();
    }));
    it("DELETE /videos should delete all videos", () => __awaiter(void 0, void 0, void 0, function* () {
        yield videoRepository.create(sampleVideo);
        yield videoRepository.create({
            title: "Another Video",
            author: "Another Author",
            availableResolutions: [videos_1.AvailableResolution.P240],
        });
        const response = yield request(application).delete("/videos");
        expect(response.status).toBe(204);
        const allVideos = yield videoRepository.findAll();
        expect(allVideos.length).toBe(0);
    }));
});
