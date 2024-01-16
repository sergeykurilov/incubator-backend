import express, { Express } from 'express';
import { Server } from 'http';

import { inject, injectable } from 'inversify';
import { ILogger } from '../common/logger/logger.interface';
import { SERVICE_IDENTIFIER } from '../common/consts/service-identifiers';
import { IExceptionFilter } from '../common/exceptions/exception.filter.interface';
import { IVideoService } from './services/video/video.service.interface';
import { IVideoController } from './controllers/video/video.controller.interface';
import 'reflect-metadata';

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
    @inject(SERVICE_IDENTIFIER.ExceptionFilter)
    private exceptionFilter: IExceptionFilter
  ) {
    this.app = express();
    this.port = 8000;
  }

  useMiddleware(): void {
    this.app.use(express.json());
  }

  useRoutes(): void {
    this.app.use('/videos', this.videoController.router);
    this.app.delete('/testing/all-data', async (req, res, next) => {
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
    this.server = this.app.listen(this.port);
    this.logger.log(`Server running on http://localhost:${this.port}`);
  }

  public close(): void {
    this.server.close();
  }
}
