import { Request, Response } from "express";
import { AvailableResolution, Video, videos } from "../../settings";
import { videosRouter } from "../index";

type RequestWithParams<P> = Request<P, unknown, unknown, unknown>;
type RequestWithBody<B> = Request<unknown, unknown, B, unknown>;
type Param = {
  id: number;
};

type ErrorMessageType = {
  field: string;
  message: string;
};

type ErrorType = {
  errorMessages: ErrorMessageType[];
};

type CreateVideoType = {
  title: string;
  author: string;
  availableResolutions: AvailableResolution[];
};

videosRouter.get("/", (req, res: Response) => {
  res.send(videos);
});

videosRouter.get("/:id", (req: RequestWithParams<Param>, res: Response) => {
  const id = +req.params.id;
  const video = videos.find((v) => v.id === id);

  if (!video) {
    res.sendStatus(404);
    return;
  }

  res.send(video);
});

videosRouter.post("/", (req: RequestWithBody<CreateVideoType>, res) => {
  const errors: ErrorType = {
    errorMessages: [],
  };

  let { title, author, availableResolutions } = req.body;

  if (!title || typeof title !== "string" || title.trim().length > 40) {
    errors.errorMessages.push({
      message: "Incorrect Title",
      field: "title",
    });
  }

  if (!author || typeof author !== "string" || author.trim().length > 20) {
    errors.errorMessages.push({
      message: "Incorrect Title",
      field: "title",
    });
  }

  if (Array.isArray(availableResolutions)) {
    availableResolutions.forEach((resolutions: AvailableResolution) => {
      if (!AvailableResolution[resolutions]) {
        errors.errorMessages.push({
          message: "Incorrect avaliableResolutions",
          field: "avaliableResolutions",
        });
        return;
      }
    });
  } else {
    availableResolutions = [];
  }

  if (errors.errorMessages.length) {
    res.status(400).send(errors);
    return;
  }

  const createdAt = new Date();
  const publishedAt = new Date();

  publishedAt.setDate(createdAt.getDate() + 1);

  const newVideo: Video = {
    id: new Date().valueOf(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publishedAt.toISOString(),
    title,
    author,
    availableResolutions,
  };

  res.send(newVideo);
});

videosRouter.delete("/testing/all-data", (req, res) => {
  videos.length = 0;

  res.sendStatus(204);
});
