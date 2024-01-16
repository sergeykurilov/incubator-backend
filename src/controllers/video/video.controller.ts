import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../common/controllers/base.controller";
import { IVideoController } from "./video.controller.interface";
import { inject } from "inversify";
import { SERVICE_IDENTIFIER } from "../../../common/consts/service-identifiers";
import { VideoService } from "../../services/video/video.service";
import { LoggerService } from "../../../common/logger/logger.service";
import "reflect-metadata";
import { HTTPMethods } from "../../../common/interfaces/route.interface";
import { ErrorType } from "../../types/videos";

export class VideoController
  extends BaseController
  implements IVideoController
{
  constructor(
    @inject(SERVICE_IDENTIFIER.VideoService) private videoService: VideoService,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private loggerService: LoggerService<{}>,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/",
        method: HTTPMethods.GET,
        func: this.getAll,
      },
      {
        path: "/:id",
        method: HTTPMethods.GET,
        func: this.getById,
      },
      {
        path: "/",
        method: HTTPMethods.POST,
        func: this.create,
      },
      {
        path: "/:id",
        method: HTTPMethods.PUT,
        func: this.update,
      },
      {
        path: "/:id",
        method: HTTPMethods.DELETE,
        func: this.deleteById,
      },
      {
        path: "/",
        method: HTTPMethods.DELETE,
        func: this.delete,
      },
    ]);
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videos = await this.videoService.findAll();
      res.json(videos);
    } catch (error) {
      this.loggerService.error("Error getting all videos", error);
      next(error);
    }
  }

  async deleteAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const videos = await this.videoService.deleteAll();
      res.status(201);
    } catch (error) {
      this.loggerService.error("Error getting all videos", error);
      next(error);
    }
  }

  async getById({ params: { id } }: Request, res: Response): Promise<void> {
    const video = await this.videoService.findById(+id);

    if (!video) res.status(404);

    res.status(200).json(video);
  }

  async deleteById({ params: { id } }: Request, res: Response): Promise<void> {
    const video = await this.videoService.deleteById(+id);

    if (!video) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videoCreationResult = await this.videoService.createVideo(req.body);

      if (Array.isArray(videoCreationResult)) {
        res.status(400).json({ errors: videoCreationResult });
      }

      res.status(201).json(videoCreationResult);
    } catch (error) {
      this.loggerService.error("Error while creating video", error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await this.videoService.deleteAll();

      res.status(204).send();
    } catch (error) {
      this.loggerService.error("Error while deleting video", error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { errors, video: updatedVideo } =
        await this.videoService.updateVideo(id, req.body);

      const errorMessage: ErrorType = {
        errorsMessages: errors,
      };

      if (errors.length) {
        res.status(400).json(errorMessage);
      }

      if (!updatedVideo) {
        res.status(404).send("Video not found");
      }

      res.status(204).json(updatedVideo);
    } catch (error) {
      this.loggerService.error("Error while updating video", error);
      next(error);
    }
  }
}
