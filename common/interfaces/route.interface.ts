import { NextFunction, Request, Response, Router } from "express";
import { IMiddleware } from "./middleware.interface";

export const enum HTTPMethods {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PATCH = "patch",
  PUT = "put",
}

export interface IControllerRoute {
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<
    Router,
    | HTTPMethods.GET
    | HTTPMethods.POST
    | HTTPMethods.PUT
    | HTTPMethods.DELETE
    | HTTPMethods.PATCH
  >;
  middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
