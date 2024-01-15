import { injectable } from "inversify";
import { Logger } from "tslog";
import "reflect-metadata";
import { ILogger } from "./logger.interface";

@injectable()
export class LoggerService<T> implements ILogger {
  public logger: Logger<T>;

  constructor() {
    this.logger = new Logger({
      stylePrettyLogs: true,
      type: "pretty",
      name: "log",
    });
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
