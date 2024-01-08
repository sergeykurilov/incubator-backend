import { NextFunction, Request, Response, Router } from "express";
import * as videoService from "../../services/videoService";
import { CreateVideoType, Param, Video } from "../../types/videos";
import { validateVideoInput } from "../../services/validationService";

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
    res.status(400).json({ errorsMessages: validationErrors.errorMessages });
  } else {
    const newVideo = videoService.createVideo({
      ...req.body,
      canBeDownloaded: false,
      minAgeRestriction: null,
    } as Video);
    res.status(201).json(newVideo);
  }
});

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ errorsMessages: [{ message: "Invalid ID", field: "id" }] });
  }

  const videoToUpdate = videoService.findVideoById(id);
  if (!videoToUpdate) {
    return res.sendStatus(404);
  }

  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
  } = req.body;

  const validationErrors = [];

  if (!title || typeof title !== "string" || title.trim().length > 40) {
    validationErrors.push({ field: "title", message: "Incorrect Title" });
  }

  if (!author || typeof author !== "string" || author.trim().length > 20) {
    validationErrors.push({ field: "author", message: "Incorrect Author" });
  }

  if (!Array.isArray(availableResolutions)) {
    validationErrors.push({
      field: "availableResolutions",
      message: "Incorrect availableResolutions",
    });
  }

  if (typeof canBeDownloaded !== "boolean") {
    validationErrors.push({
      field: "canBeDownloaded",
      message: "canBeDownloaded must be a boolean",
    });
  }

  if (minAgeRestriction !== undefined) {
    if (typeof minAgeRestriction !== "number" || minAgeRestriction < 0) {
      validationErrors.push({
        field: "minAgeRestriction",
        message: "minAgeRestriction must be a non-negative number",
      });
    }
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({ errorsMessages: validationErrors });
  }

  const success = videoService.updateVideoById(id, req.body);
  if (success) {
    return res.sendStatus(204);
  } else {
    return res.status(400).json({
      errorsMessages: [{ message: "Update failed", field: "videoData" }],
    });
  }
});

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

export default router;
