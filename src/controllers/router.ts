import { Router } from "express";
import videoRoutes from "./video/videoRoutes";
import * as videoService from "../services/videoService";

const router = Router();

router.use("/videos", videoRoutes);

router.delete("/testing/all-data", (req, res, next) => {
  try {
    videoService.deleteAllVideos();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default router;
