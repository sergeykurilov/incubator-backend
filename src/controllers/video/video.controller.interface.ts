import { NextFunction, Request, Response, Router } from "express";

export interface IVideoController {
  getAll: (req: Request, res: Response, next: NextFunction) => void;
  getById: (req: Request, res: Response, next: NextFunction) => void;
  deleteById: (req: Request, res: Response, next: NextFunction) => void;
  deleteAll: (req: Request, res: Response, next: NextFunction) => void;
  create: (req: Request, res: Response, next: NextFunction) => void;
  update: (req: Request, res: Response, next: NextFunction) => void;
  router: Router;
}
