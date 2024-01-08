import { Request, Response, Router } from "express";
import * as videoService from "../../services/videoService";
import { CreateVideoType, Param, Video } from "../../types/videos";
import { validateVideoInput } from "../../services/validationService";
const { parseISO, isValid } = require("date-fns"); // date-fns library for date validation

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
  try {
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
      canBeDownloaded = false,
      minAgeRestriction,
      publicationDate,
    } = req.body;

    const validationErrors = [];

    // Title validation
    if (!title || typeof title !== "string" || title.trim().length > 40) {
      validationErrors.push({ field: "title", message: "Incorrect Title" });
    }

    // Author validation
    if (!author || typeof author !== "string" || author.trim().length > 20) {
      validationErrors.push({ field: "author", message: "Incorrect Author" });
    }

    // Available Resolutions validation
    if (availableResolutions && !Array.isArray(availableResolutions)) {
      validationErrors.push({
        field: "availableResolutions",
        message: "Incorrect availableResolutions",
      });
    }

    // canBeDownloaded validation
    if (typeof canBeDownloaded !== "boolean") {
      validationErrors.push({
        field: "canBeDownloaded",
        message: "canBeDownloaded must be a boolean",
      });
    }

    // Min Age Restriction validation
    if (minAgeRestriction !== undefined && minAgeRestriction !== null) {
      if (
        typeof minAgeRestriction !== "number" ||
        minAgeRestriction < 1 ||
        minAgeRestriction > 18
      ) {
        validationErrors.push({
          field: "minAgeRestriction",
          message:
            "minAgeRestriction must be a number between 1 and 18 (inclusive)",
        });
      }
    }

    // Publication Date validation
    if (publicationDate !== undefined && publicationDate !== null) {
      // Check if publicationDate is a string and a valid ISO 8601 date
      if (
        typeof publicationDate !== "string" ||
        !isValid(parseISO(publicationDate))
      ) {
        validationErrors.push({
          field: "publicationDate",
          message: "publicationDate must be a valid ISO 8601 date",
        });
      }
    }

    // Check if any validation errors exist
    if (validationErrors.length > 0) {
      return res.status(400).json({ errorsMessages: validationErrors });
    }

    // Update video logic
    const success = videoService.updateVideoById(id, req.body);
    if (success) {
      return res.sendStatus(204);
    } else {
      return res.status(400).json({
        errorsMessages: [{ message: "Update failed", field: "videoData" }],
      });
    }
  } catch (error) {
    console.error("Error in PUT /videos/:id", error); // Logging the error
    return res.status(500).json({ message: "Internal Server Error 1" });
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
