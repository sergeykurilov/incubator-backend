import { type NextFunction, type Request, type Response } from "express";
import "reflect-metadata";
import { inject } from "inversify";
import { PostService } from "../services/post.service";
import { RequestWithParams } from "../../common/types";
import { BaseController } from "../../common/controllers/base.controller";
import { SERVICE_IDENTIFIER } from "../../common/consts/service-identifiers.consts";
import { HTTPMethods } from "../../common/interfaces/route.interface";
import { HttpStatusCodes } from "../../common/interfaces/http-status-codes.interface";
import { LoggerService } from "../../common/logger/logger.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { EntityGuard } from "../../common/guards/entity.guard";
import { IPostController } from "./post.controller.interface";
import { PostDto } from "./dto/post.dto";

export class PostController extends BaseController implements IPostController {
  constructor(
    @inject(SERVICE_IDENTIFIER.BlogService)
    private readonly postService: PostService,
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
        path: "/",
        method: HTTPMethods.POST,
        func: this.create,
        middlewares: [new AuthGuard(), new EntityGuard(PostDto)],
      },
      {
        path: "/:id",
        method: HTTPMethods.PUT,
        func: this.update,
        middlewares: [new AuthGuard(), new EntityGuard(PostDto)],
      },
      {
        path: "/:id",
        method: HTTPMethods.GET,
        func: this.getById,
      },
      {
        path: "/:id",
        method: HTTPMethods.DELETE,
        func: this.deleteById,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const blogs = await this.postService.findAll();
      return res.status(HttpStatusCodes.OK).json(blogs);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await this.postService.create(req.body);
      return res.sendStatus(HttpStatusCodes.OK);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await this.postService.update(String(req.params.id!), req.body);
      return res.sendStatus(HttpStatusCodes.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  }
  async getById(req: RequestWithParams, res: Response, next: NextFunction) {
    try {
      const blog = await this.postService.findById(String(req.params.id!));
      return res.status(HttpStatusCodes.OK).json(blog);
    } catch (error) {
      return next(error);
    }
  }

  async deleteById(req: RequestWithParams, res: Response, next: NextFunction) {
    try {
      const id = req.params.id!;
      const video = await this.postService.deleteById(String(id));

      return res.status(HttpStatusCodes.OK).json(video);
    } catch (error) {
      return next(error);
    }
  }

  async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {
      await this.postService.deleteAll();

      return res.sendStatus(HttpStatusCodes.OK);
    } catch (error) {
      return next(error);
    }
  }
}
