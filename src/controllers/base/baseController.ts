import { Router, Request, Response, NextFunction } from "express";

abstract class BaseController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;

  protected handleExceptions(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }

  protected send<T>(res: Response, code: number, message: T) {
    res.type("application/json");
    return res.status(code).json(message);
  }
}

export default BaseController;
