const request = require("supertest");
const app = require("../src/index");
const {
  createVideo,
  findAllVideos,
  findVideoById,
} = require("../src/services/videoService");

const sampleVideo = {
  title: "Sample Video",
  author: "Test Author",
  availableResolutions: ["P144"],
};

describe("Video API Routes", () => {
  beforeEach(() => {
    findAllVideos().length = 0;
  });

  it("GET /videos should return a list of videos", async () => {
    createVideo(sampleVideo);

    const response = await request(app).get("/videos");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("GET /api/videos/:id should return a single video by ID", async () => {
    const createdVideo = createVideo(sampleVideo);
    const videoId = createdVideo.id;

    const response = await request(app).get(`/videos/${videoId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(videoId);
  });

  it("POST /videos should create a new video", async () => {
    const response = await request(app).post("/videos").send(sampleVideo);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(sampleVideo.title);

    expect(findVideoById(response.body.id)).toBeTruthy();
  });

  it("PUT /videos/:id should update an existing video with valid data", async () => {
    const createdVideo = createVideo(sampleVideo);
    const videoId = createdVideo.id;

    const updatedData = {
      id: videoId,
      title: "Updated Title", // Update the title to valid data
      author: "Updated Author", // Update the author to valid data
      canBeDownloaded: true,
      minAgeRestriction: 18, // Update minAgeRestriction to valid data
      createdAt: "2024-01-02T15:40:19.154Z",
      publicationDate: "2024-01-02T15:40:19.154Z",
      availableResolutions: ["P144"],
    };

    const response = await request(app)
      .put(`/videos/${videoId}`)
      .send(updatedData);

    expect(response.status).toBe(204);

    const updatedVideo = findVideoById(videoId);
    expect(updatedVideo.title).toBe(updatedData.title);
  });

  it("PUT /videos/:id should return a 400 error with invalid data", async () => {
    const createdVideo = createVideo(sampleVideo);
    const videoId = createdVideo.id;

    const invalidData = {
      author: "length_21-weqweqweqwq",
      title: "valid title",
      availableResolutions: ["P240", "P720"],
      canBeDownloaded: true,
      minAgeRestriction: 15,
      publicationDate: 1995,
    };

    const response = await request(app)
      .put(`/videos/${videoId}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errorsMessages).toEqual([
      {
        field: "author",
        message: "Incorrect Author",
      },
      {
        field: "publicationDate",
        message: "publicationDate must be a valid ISO 8601 date",
      },
    ]);

    const unchangedVideo = findVideoById(videoId);
    expect(unchangedVideo.title).toBe(sampleVideo.title);
  });

  it("DELETE /api/videos/:id should delete an existing video", async () => {
    const createdVideo = createVideo(sampleVideo);
    const videoId = createdVideo.id;

    const response = await request(app).delete(`/videos/${videoId}`);
    expect(response.status).toBe(204);

    expect(findVideoById(videoId)).toBeUndefined();
  });

  it("DELETE /videos should delete all videos", async () => {
    createVideo(sampleVideo);
    createVideo({
      title: "Another Video",
      author: "Another Author",
      availableResolutions: ["P240"],
    });

    const response = await request(app).delete("/testing/all-data");
    expect(response.status).toBe(204);

    expect(findAllVideos().length).toBe(0);
  });
});
