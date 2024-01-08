import { Request, Response, Router } from "express";
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

router.delete("/testing/all-data", (req: Request, res: Response) => {
  videoService.deleteAllVideos();
  res.sendStatus(204);
});

export default router;
