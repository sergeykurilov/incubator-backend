import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import "reflect-metadata";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";
import { MongoDBService } from "./database/database.service";
import { IVideoService } from "./modules/video/services/video.service.interface";
import { VideoService } from "./modules/video/services/video.service";
import { IVideoController } from "./modules/video/controllers/video.controller.interface";
import { VideoController } from "./modules/video/controllers/video.controller";
import { IVideoRepository } from "./modules/video/repositories/video.repository.interface";
import { VideoRepository } from "./modules/video/repositories/video.repository";
import { ILogger } from "./modules/common/logger/logger.interface";
import { SERVICE_IDENTIFIER } from "./modules/common/consts/service-identifiers.consts";
import { LoggerService } from "./modules/common/logger/logger.service";
import { IExceptionFilter } from "./modules/common/exceptions/exception.filter.interface";
import { ExceptionFilter } from "./modules/common/exceptions/exception.filter";
import { IBlogService } from "./modules/blog/services/blog.service.interface";
import { BlogService } from "./modules/blog/services/blog.service";
import { IBlogController } from "./modules/blog/controllers/blog.controller.interface";
import { BlogController } from "./modules/blog/controllers/blog.controller";
import { IBlogRepository } from "./modules/blog/repositories/blog.repository.interface";
import { BlogRepository } from "./modules/blog/repositories/blog.repository";
import { IPostService } from "./modules/post/services/post.service.interface";
import { PostService } from "./modules/post/services/post.service";
import { IPostController } from "./modules/post/controllers/post.controller.interface";
import { PostController } from "./modules/post/controllers/post.controller";
import { PostRepository } from "./modules/post/repositories/post.repository";
import { IPostRepository } from "./modules/post/repositories/post.repository.interface";

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

  bind<IBlogService>(SERVICE_IDENTIFIER.BlogService)
    .to(BlogService)
    .inSingletonScope();
  bind<IBlogController>(SERVICE_IDENTIFIER.BlogController)
    .to(BlogController)
    .inSingletonScope();
  bind<IBlogRepository>(SERVICE_IDENTIFIER.BlogRepository)
    .to(BlogRepository)
    .inSingletonScope();

  bind<IPostService>(SERVICE_IDENTIFIER.PostService)
    .to(PostService)
    .inSingletonScope();
  bind<IPostController>(SERVICE_IDENTIFIER.PostController)
    .to(PostController)
    .inSingletonScope();
  bind<IPostRepository>(SERVICE_IDENTIFIER.PostRepository)
    .to(PostRepository)
    .inSingletonScope();

  bind<MongoDBService>(SERVICE_IDENTIFIER.MongoDBService)
    .to(MongoDBService)
    .inSingletonScope();
  bind<IConfigService>(SERVICE_IDENTIFIER.ConfigService)
    .to(ConfigService)
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

export default bootstrap();
