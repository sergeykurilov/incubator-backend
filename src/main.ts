import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { ILogger } from "../common/logger/logger.interface";
import { LoggerService } from "../common/logger/logger.service";
import { SERVICE_IDENTIFIER } from "../common/consts/service-identifiers";
import { IExceptionFilter } from "../common/exceptions/exception.filter.interface";
import { ExceptionFilter } from "../common/exceptions/exception.filter";
import { IVideoRepository } from "./repositories/video/video.repository.interface";
import { VideoRepository } from "./repositories/video/video.repository";
import { IVideoService } from "./services/video/video.service.interface";
import { VideoService } from "./services/video/video.service";
import { VideoController } from "./controllers/video/video.controller";
import { IVideoController } from "./controllers/video/video.controller.interface";
import "reflect-metadata";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(SERVICE_IDENTIFIER.ILogger)
    .to(LoggerService)
    .inSingletonScope();
  bind<IExceptionFilter>(SERVICE_IDENTIFIER.ExceptionFilter)
    .to(ExceptionFilter)
    .inSingletonScope();
  bind<App>(SERVICE_IDENTIFIER.Application).to(App).inSingletonScope();
  bind<IVideoService>(SERVICE_IDENTIFIER.VideoService)
    .to(VideoService)
    .inSingletonScope();
  bind<IVideoController>(SERVICE_IDENTIFIER.VideoController)
    .to(VideoController)
    .inSingletonScope();
  bind<IVideoRepository>(SERVICE_IDENTIFIER.VideoRepository)
    .to(VideoRepository)
    .inSingletonScope();
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(SERVICE_IDENTIFIER.Application);

  await app.init().catch((error) => {
    console.error("Error during initialization:", error);
    app.close();
  });

  return { appContainer, app };
}

export const boot = bootstrap();
