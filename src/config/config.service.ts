import { IConfigService } from "./config.service.interface";
import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { inject, injectable } from "inversify";
import { SERVICE_IDENTIFIER } from "../modules/common/consts/service-identifiers.consts";
import { ILogger } from "../modules/common/logger/logger.interface";
import path from "path";

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(SERVICE_IDENTIFIER.ILogger) private logger: ILogger) {
    const result: DotenvConfigOutput = config({
      path: path.resolve(__dirname, ".env"),
    });
    if (result.error) {
      this.logger.error(
        "[ConfigService] Cannot read file .env or it doesnt exist",
      );
    } else {
      this.logger.log("[ConfigService] config .env loaded");
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
