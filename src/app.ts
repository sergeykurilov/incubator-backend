import express, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IConfigService } from "./config/config.service.interface";
import { MongoDBService } from "./database/database.service";
import { IVideoController } from "./modules/video/controllers/video.controller.interface";
import { IVideoService } from "./modules/video/services/video.service.interface";
import { IBlogController } from "./modules/blog/controllers/blog.controller.interface";
import { SERVICE_IDENTIFIER } from "./modules/common/consts/service-identifiers.consts";
import { ILogger } from "./modules/common/logger/logger.interface";
import { IExceptionFilter } from "./modules/common/exceptions/exception.filter.interface";
import { IBlogService } from "./modules/blog/services/blog.service.interface";
import { IPostController } from "./modules/post/controllers/post.controller.interface";
import { IPostService } from "./modules/post/services/post.service.interface";
import { createLogger, format, transports } from "winston";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(SERVICE_IDENTIFIER.ILogger) private logger: ILogger,
    @inject(SERVICE_IDENTIFIER.VideoController)
    private videoController: IVideoController,
    @inject(SERVICE_IDENTIFIER.VideoService)
    private videoService: IVideoService,

    @inject(SERVICE_IDENTIFIER.BlogController)
    private blogController: IBlogController,
    @inject(SERVICE_IDENTIFIER.BlogService)
    private blogService: IBlogService,

    @inject(SERVICE_IDENTIFIER.PostController)
    private postController: IPostController,
    @inject(SERVICE_IDENTIFIER.BlogService)
    private postService: IPostService,

    @inject(SERVICE_IDENTIFIER.ExceptionFilter)
    private exceptionFilter: IExceptionFilter,
    @inject(SERVICE_IDENTIFIER.ConfigService)
    private configService: IConfigService,
    @inject(SERVICE_IDENTIFIER.MongoDBService)
    private mongoDbService: MongoDBService,
  ) {
    this.app = express();
    console.log(process.env.PORT);
    this.port = Number(this.configService.get("PORT")) || 8300;
  }

  useMiddleware(): void {
    const logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
      transports: [new transports.Console()],
    });

    this.app.use(express.json());
    this.app.use((req, res, next) => {
      logger.info(`Incoming request: ${req.method} ${req.url}`);
      next();
    });
  }

  useRoutes(): void {
    this.app.use("/videos", this.videoController.router);
    this.app.use("/blogs", this.blogController.router);
    this.app.use("/posts", this.postController.router);
    this.app.delete("/testing/all-data", async (req, res, next) => {
      try {
        await this.videoService.deleteAll();
        res.sendStatus(204);
      } catch (error) {
        next(error);
      }
    });
  }

  useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExceptionFilters();
    await this.mongoDbService.connect();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server running on http://localhost:${this.port}`);
  }

  public close(): void {
    this.server.close();
  }
}
