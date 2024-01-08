import { Router } from "express";
import videoRoutes from "./videoRoutes/videoRoutes";

const router = Router();

router.use("/videos", videoRoutes);

export default router;
