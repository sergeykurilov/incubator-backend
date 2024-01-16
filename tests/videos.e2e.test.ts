import { App } from "supertest/types";
import { boot } from "../src/main";
import { VideoRepository } from "../src/repositories/video/video.repository";
import { AvailableResolution, VideoModel } from "../src/types/videos";
import { IVideoRepository } from "../src/repositories/video/video.repository.interface";
import { SERVICE_IDENTIFIER } from "../common/consts/service-identifiers";
const request = require("supertest");

const sampleVideo = {
  title: "Sample Video",
  author: "Test Author",
  availableResolutions: ["P144"],
};

describe("Video API Routes", () => {
  let application: App;
  let videoRepository: VideoRepository;

  beforeAll(async () => {
    const bootstrap = await boot;
    application = bootstrap.app.app;
    videoRepository = bootstrap.appContainer.get<IVideoRepository>(
      SERVICE_IDENTIFIER.VideoRepository,
    );
  });

  beforeEach(async () => {
    await videoRepository.deleteAll();
  });

  it("PUT /videos/:id should return error for invalid publicationDate", async () => {
    const createdVideo = await videoRepository.create(
      sampleVideo as VideoModel,
    );

    const invalidData = {
      author: "length_20-weqweqweqw",
      title: "valid title",
      availableResolutions: ["P240", "P720"],
      canBeDownloaded: true,
      minAgeRestriction: 15,
      publicationDate: "1995", // Invalid publicationDate
    };

    const response = await request(application)
      .put(`/videos/${createdVideo.id}`)
      .send(invalidData);

    expect(response.status).toBe(400);

    expect(response.body.errorsMessages).toEqual([
      {
        field: "publicationDate",
        message: "publicationDate must be a valid ISO 8601 date",
      },
    ]);

    const unchangedVideo = await videoRepository.findById(createdVideo.id);
    expect(unchangedVideo?.title).toBe(sampleVideo.title);
  });

  it("PUT /videos/:id should return error messages for invalid data", async () => {
    const createdVideo = await videoRepository.create(
      sampleVideo as VideoModel,
    );

    const invalidData = {
      author: "length_21-weqweqweqwq",
      title: "valid title",
      availableResolutions: ["P240", "P720"],
      canBeDownloaded: "string",
      minAgeRestriction: 15,
      publicationDate: "1995",
    };

    const response = await request(application)
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
        message: "Incorrect Author",
      },
    ]);

    const unchangedVideo = await videoRepository.findById(createdVideo.id);
    expect(unchangedVideo?.title).toBe(sampleVideo.title);
  });

  it("PUT, DELETE, GET /videos/:id should return a 404 status when the video ID is not found", async () => {
    const nonExistentVideoId = 9999;

    const putResponse = await request(application)
      .put(`/videos/${nonExistentVideoId}`)
      .send({ title: "Updated Title" });

    const deleteResponse = await request(application).delete(
      `/videos/${nonExistentVideoId}`,
    );

    const getResponse = await request(application).get(
      `/videos/${nonExistentVideoId}`,
    );

    expect(putResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);
    expect(getResponse.status).toBe(404);
  });

  it("PUT /videos should return error for incorrect input data", async () => {
    const createdVideo = await videoRepository.create(
      sampleVideo as VideoModel,
    );

    const invalidData = {
      author: "valid author",
      title: null,
      availableResolutions: ["P144", "P240", "P720"],
      canBeDownloaded: "string",
      minAgeRestriction: 17,
      publicationDate: "2024-01-22T14:14:16.818Z",
    };

    const response = await request(application)
      .put(`/videos/${createdVideo.id}`)
      .send(invalidData);

    expect(response.status).toBe(400);

    expect(response.body.errorsMessages).toEqual([
      {
        field: "title",
        message:
          "Title is required and must be a string of at most 40 characters",
      },
      {
        field: "canBeDownloaded",
        message: "canBeDownloaded must be a boolean",
      },
    ]);

    const unchangedVideo = await videoRepository.findById(createdVideo.id);
    expect(unchangedVideo?.title).toBe(sampleVideo.title);
  });

  it("DELETE /videos/:id should return 404 when video is not found", async () => {
    const invalidVideoId = 999;

    const response = await request(application)
      .delete(`/videos/${invalidVideoId}`)
      .send();

    expect(response.status).toBe(404);
  });

  it("GET /videos should return a list of videos", async () => {
    await videoRepository.create(sampleVideo as VideoModel);

    const response = await request(application).get("/videos");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("GET /videos/:id should return a single video by ID", async () => {
    const createdVideo = await videoRepository.create(
      sampleVideo as VideoModel,
    );

    const response = await request(application).get(
      `/videos/${createdVideo.id}`,
    );
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdVideo.id);
  });

  it("DELETE /videos/:id should return a 404 error with invalid video ID", async () => {
    const invalidVideoId = 999;

    const updatedData = {
      title: "Updated Title",
      author: "Updated Author",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      availableResolutions: ["P144"],
    };

    const response = await request(application)
      .put(`/videos/${invalidVideoId}`)
      .send(updatedData);

    expect(response.status).toBe(404);
  });

  it("GET /videos should return a list of videos with defined values", async () => {
    await videoRepository.create(sampleVideo as VideoModel);

    const response = await request(application).get("/videos");
    expect(response.status).toBe(200);

    expect(response.body.every((video: VideoModel) => video.createdAt)).toBe(
      true,
    );
    console.log(response.body);
    expect(
      response.body.every((video: VideoModel) => video.publicationDate),
    ).toBe(true);
  });

  it("POST /videos should create a new video", async () => {
    const response = await request(application)
      .post("/videos")
      .send(sampleVideo);

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(sampleVideo.title);

    const createdVideo = await videoRepository.findById(response.body.id);
    expect(createdVideo).toBeTruthy();
  });

  it("PUT /videos/:id should update an existing video with valid data", async () => {
    const createdVideo = await videoRepository.create(
      sampleVideo as VideoModel,
    );

    const updatedData = {
      title: "Updated Title",
      author: "Updated Author",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      availableResolutions: ["P144"],
    };

    const response = await request(application)
      .put(`/videos/${createdVideo.id}`)
      .send(updatedData);

    expect(response.status).toBe(204);

    const updatedVideo = await videoRepository.findById(createdVideo.id);
    expect(updatedVideo?.title).toBe(updatedData.title);
  });

  it("PUT /videos/:id should return a 404 error with invalid video ID", async () => {
    const invalidVideoId = 999;

    const updatedData = {
      title: "Updated Title",
      author: "Updated Author",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      availableResolutions: ["P144"],
    };

    const response = await request(application)
      .put(`/videos/${invalidVideoId}`)
      .send(updatedData);

    expect(response.status).toBe(404);
  });

  it("PUT /videos/:id should return a 400 error with invalid data", async () => {
    const createdVideo = await videoRepository.create(
      sampleVideo as VideoModel,
    );

    const invalidData = {
      author: "length_21-weqweqweqwq",
      title: "valid title",
      availableResolutions: ["P240", "P720"],
      canBeDownloaded: true,
      minAgeRestriction: 15,
      publicationDate: 1995,
    };

    const response = await request(application)
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
        message: "Incorrect Author",
      },
    ]);

    const unchangedVideo = await videoRepository.findById(createdVideo.id);
    expect(unchangedVideo?.title).toBe(sampleVideo.title);
  });

  it("DELETE /videos/:id should delete an existing video", async () => {
    const createdVideo = await videoRepository.create(
      sampleVideo as VideoModel,
    );

    const response = await request(application).delete(
      `/videos/${createdVideo.id}`,
    );
    expect(response.status).toBe(204);

    const deletedVideo = await videoRepository.findById(createdVideo.id);
    expect(deletedVideo).toBeNull();
  });

  it("DELETE /videos should delete all videos", async () => {
    await videoRepository.create(sampleVideo as VideoModel);
    await videoRepository.create({
      title: "Another Video",
      author: "Another Author",
      availableResolutions: [AvailableResolution.P240],
    } as VideoModel);

    const response = await request(application).delete("/videos");
    expect(response.status).toBe(204);

    const allVideos = await videoRepository.findAll();
    expect(allVideos.length).toBe(0);
  });
});
