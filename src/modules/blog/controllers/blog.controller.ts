import { type NextFunction, type Request, type Response } from "express";
import "reflect-metadata";
import { inject } from "inversify";
import { IBlogController } from "./blog.controller.interface";
import { BlogService } from "../services/blog.service";
import { RequestWithParams } from "../../common/types";
import { BaseController } from "../../common/controllers/base.controller";
import { SERVICE_IDENTIFIER } from "../../common/consts/service-identifiers.consts";
import { HTTPMethods } from "../../common/interfaces/route.interface";
import { HttpStatusCodes } from "../../common/interfaces/http-status-codes.interface";
import { LoggerService } from "../../common/logger/logger.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { EntityGuard } from "../../common/guards/entity.guard";
import { BlogDto } from "./dto/blog.dto";

export class BlogController extends BaseController implements IBlogController {
  constructor(
    @inject(SERVICE_IDENTIFIER.BlogService)
    private readonly blogService: BlogService,
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
        middlewares: [new AuthGuard(), new EntityGuard(BlogDto)],
      },
      {
        path: "/:id",
        method: HTTPMethods.PUT,
        func: this.update,
        middlewares: [new AuthGuard(), new EntityGuard(BlogDto)],
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

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogs = await this.blogService.findAll();
      res.json(blogs);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.blogService.create(req.body);
      this.created(res);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.blogService.update(String(req.params.id!), req.body);
      this.created(res);
    } catch (error) {
      next(error);
    }
  }
  async getById(
    req: RequestWithParams,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const blog = await this.blogService.findById(String(req.params.id!));
      res.status(HttpStatusCodes.OK).json(blog);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(
    req: RequestWithParams,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id!;
      const video = await this.blogService.deleteById(String(id));

      res.status(HttpStatusCodes.OK).json(video);
    } catch (error) {
      next(error);
    }
  }
}
