import { Request, Response, Router } from "express";
import { AvailableResolution, Video, videos } from "../../settings";

const router = Router();

type Param = {
  id: number;
};

type CreateVideoType = {
  title: string;
  author: string;
  availableResolutions: AvailableResolution[];
};

interface ErrorMessage {
  field: string;
  message: string;
}

interface ErrorType {
  errorMessages: ErrorMessage[];
}

const validateVideoInput = (reqBody: CreateVideoType): ErrorType | null => {
  const errors: ErrorType = { errorMessages: [] };
  const { title, author, availableResolutions } = reqBody;

  if (!title || typeof title !== "string" || title.trim().length > 40) {
    errors.errorMessages.push({
      field: "title",
      message: "Incorrect Title",
    });
  }

  if (!author || typeof author !== "string" || author.trim().length > 20) {
    errors.errorMessages.push({
      field: "author",
      message: "Incorrect Author",
    });
  }

  if (!Array.isArray(availableResolutions)) {
    errors.errorMessages.push({
      field: "availableResolutions",
      message: "Incorrect availableResolutions",
    });
  } else {
    availableResolutions.forEach((resolution) => {
      if (!AvailableResolution[resolution]) {
        errors.errorMessages.push({
          field: "availableResolutions",
          message: "Invalid availableResolutions value",
        });
      }
    });
  }

  return errors.errorMessages.length ? errors : null;
};

router.get("/", (req: Request, res: Response) => {
  res.send(videos);
});

router.get("/:id", (req: Request<Param>, res: Response) => {
  const id = +req.params.id;
  const video = videos.find((v) => v.id === id);

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
    const createdAt = new Date();
    const publishedAt = new Date();
    publishedAt.setDate(createdAt.getDate() + 1);

    const newVideo: Video = {
      id: new Date().valueOf(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publishedAt.toISOString(),
      ...req.body,
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
  }
});

router.delete("/testing/all-data", (req: Request, res: Response) => {
  videos.length = 0;
  res.sendStatus(204);
});

export default router;
