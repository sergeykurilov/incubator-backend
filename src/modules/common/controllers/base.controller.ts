import { Response, Router } from "express";
import { ILogger } from "../logger/logger.interface";
import { injectable } from "inversify";
export { Router } from "express";
import "reflect-metadata";
import {
  ExpressReturnType,
  HTTPMethods,
  IControllerRoute,
} from "../interfaces/route.interface";
import { HttpStatusCodes } from "../interfaces/http-status-codes.interface";

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type("application/json");
    return res.status(HttpStatusCodes.OK).json(message);
  }

  public ok<T>(res: Response, message: T): ExpressReturnType {
    return this.send<T>(res, HttpStatusCodes.OK, message);
  }

  public created(res: Response): ExpressReturnType {
    return res.status(HttpStatusCodes.CREATED);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);
      const middleware = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;
      const method: HTTPMethods = route.method;
      this.router[method](route.path, pipeline);
    }
  }
}
