import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../interfaces/http-status-codes.interface";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ClassConstructor } from "class-transformer";

interface FieldError {
  message: string | null;
  field: string | null;
}

interface APIErrorResult {
  errorsMessages: FieldError[] | null;
}

export class EntityGuard {
  constructor(private dtoClass: ClassConstructor<Object>) {}

  async execute(req: Request, res: Response, next: NextFunction) {
    const dtoInstance = plainToInstance(this.dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages: FieldError[] = errors.map((err) => ({
        field: err.property,
        message: Object.values(err.constraints!).join(", "),
      }));

      const apiErrorResult: APIErrorResult = {
        errorsMessages: errorMessages,
      };

      return res.sendStatus(HttpStatusCodes.BAD_REQUEST).json(apiErrorResult);
    }

    return next();
  }
}
