import { Request, Response, Router } from "express";
import * as videoService from "../../services/videoService";
import { CreateVideoType, Param, Video } from "../../types/videos";
import { validateVideoInput } from "../../services/validationService";
import { updateVideoById } from "../../services/videoService";
import { videos } from "../../settings";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const videos = videoService.findAllVideos();
  res.send(videos);
});

router.get("/:id", (req: Request<Param>, res: Response) => {
  const id = +req.params.id;
  const video = videoService.findVideoById(id);

  if (!video) {
    res.sendStatus(404);
  } else {
    res.send(video);
  }
});

router.post("/", (req: Request<{}, {}, CreateVideoType>, res: Response) => {
  const validationErrors = validateVideoInput(req.body);

  if (validationErrors) {
    res.status(400).json(validationErrors);
  } else {
    const newVideo = videoService.createVideo({
      ...req.body,
      canBeDownloaded: false,
      minAgeRestriction: null,
    } as Video);
    res.status(201).json(newVideo);
  }
});

router.put(
  "/:id",
  (req: Request<Param, {}, CreateVideoType>, res: Response) => {
    const id = parseInt(String(req.params.id));

    // Validate ID
    if (isNaN(id)) {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: "Invalid ID", field: "id" }] });
    }

    // Check if the video exists
    const videoToUpdate = videoService.findVideoById(id);
    if (!videoToUpdate) {
      return res.sendStatus(404);
    }

    // Validate the request body
    const validationErrors = validateVideoInput(req.body);
    if (validationErrors) {
      return res.status(400).json(validationErrors);
    }

    // Update the video
    const success = videoService.updateVideoById(id, req.body);
    if (success) {
      return res.sendStatus(204);
    } else {
      return res.status(400).send({
        errorsMessages: [{ message: "Update failed", field: "videoData" }],
      });
    }
  },
);

router.delete("/:id", (req: Request<Param>, res: Response) => {
  const id = +req.params.id;
  const video = videoService.findVideoById(id);

  if (!video) {
    res.sendStatus(404);
  } else {
    videoService.deleteVideoById(id);
    res.sendStatus(204);
  }
});

router.delete("/", (req: Request, res: Response) => {
  videoService.deleteAllVideos();
  res.sendStatus(204);
});

export default router;
