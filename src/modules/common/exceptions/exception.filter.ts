import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./exception.filter.interface";
import { HTTPError } from "./http-error";
import "reflect-metadata";
import { SERVICE_IDENTIFIER } from "../consts/service-identifiers.consts";

interface FieldError {
  message: string | null;
  field: string | null;
}

interface APIErrorResult {
  errorsMessages: FieldError[] | null;
}

@injectable()
export class ExceptionFilter<T> implements IExceptionFilter {
  constructor(
    @inject(SERVICE_IDENTIFIER.ILogger) private logger: LoggerService<T>,
  ) {}

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}]: Error ${err.statusCode}: ${err.message}`,
      );
      const errorResponse: APIErrorResult = {
        errorsMessages: err.errorsMessages,
      };
      res.sendStatus(err.statusCode).json(errorResponse);
    } else {
      this.logger.error(`${err.message}`);
      const errorResponse: APIErrorResult = {
        errorsMessages: [
          {
            message: err.message,
            field: null,
          },
        ],
      };
      res.sendStatus(500).json(errorResponse);
    }
  }
}
