import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "../interfaces/middleware.interface";
import { HttpStatusCodes } from "../interfaces/http-status-codes.interface";

export class AuthGuard implements IMiddleware {
  execute(req: Request, res: Response, next: NextFunction): void {
    const auth = req.headers["authorization"] as string;

    if (!auth) {
      res.status(HttpStatusCodes.UNAUTHORIZED).send("Unauthorized");
      return;
    }

    const [basic, token] = auth.split(" ");

    if (basic !== "Basic") {
      res.status(HttpStatusCodes.UNAUTHORIZED).send();
      return;
    }

    const decodedData = Buffer.from(token, "base64").toString();
    const [login, password] = decodedData.split(":");

    if (login !== "admin" || password !== "qwerty") {
      res.status(HttpStatusCodes.UNAUTHORIZED).send();
      return;
    }

    return next();
  }
}
