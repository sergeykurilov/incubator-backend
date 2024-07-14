import { type NextFunction, type Request, type Response } from "express";
import { type IVideoController } from "./video.controller.interface";
import "reflect-metadata";
import { inject } from "inversify";
import { VideoService } from "../services/video.service";
import { ErrorType } from "../entity/videos";
import { BaseController } from "../../common/controllers/base.controller";
import { SERVICE_IDENTIFIER } from "../../common/consts/service-identifiers.consts";
import { LoggerService } from "../../common/logger/logger.service";
import { HTTPMethods } from "../../common/interfaces/route.interface";
import { HttpStatusCodes } from "../../common/interfaces/http-status-codes.interface";

export class VideoController
  extends BaseController
  implements IVideoController
{
  constructor(
    @inject(SERVICE_IDENTIFIER.VideoService)
    private readonly videoService: VideoService,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly loggerService: LoggerService<{}>,
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
      await this.videoService.deleteAll();
      res.status(HttpStatusCodes.CREATED);
    } catch (error) {
      this.loggerService.error("Error getting all videos", error);
      next(error);
    }
  }

  async getById({ params: { id } }: Request, res: Response): Promise<void> {
    const video = await this.videoService.findById(+id);

    if (!video?.id) {
      res.status(HttpStatusCodes.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatusCodes.OK).json(video);
  }

  async deleteById({ params: { id } }: Request, res: Response): Promise<void> {
    const video = await this.videoService.deleteById(+id);

    if (!video) {
      res.sendStatus(HttpStatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatusCodes.NO_CONTENT);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { video: createdVideo, errors } =
        await this.videoService.createVideo(req.body);

      const errorMessage: ErrorType = {
        errorsMessages: errors,
      };

      if (errors.length > 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).json(errorMessage);
      }

      res.status(HttpStatusCodes.CREATED).json(createdVideo);
    } catch (error) {
      this.loggerService.error("Error while creating video", error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.videoService.deleteAll();
      res.status(HttpStatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.loggerService.error("Error while deleting video", error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const {
        errors,
        video: updatedVideo,
        isVideo,
      } = await this.videoService.updateVideo(id, req.body);

      const errorMessage: ErrorType = {
        errorsMessages: errors,
      };

      // TODO: improve error handling
      if (!isVideo) {
        res.status(HttpStatusCodes.NOT_FOUND).send("Video not found");
      }

      if (errors.length > 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).json(errorMessage);
      }

      res.status(HttpStatusCodes.NO_CONTENT).json(updatedVideo);
    } catch (error) {
      this.loggerService.error("Error while updating video", error);
      next(error);
    }
  }
}
