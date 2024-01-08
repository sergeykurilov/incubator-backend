import { Router } from "express";
import videoRoutes from "./video/videoRoutes";

const router = Router();

router.use("/videos", videoRoutes);

export default router;
