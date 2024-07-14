import { injectable, inject } from "inversify";
import mongoose, { Mongoose } from "mongoose";
import { IConfigService } from "../config/config.service.interface";
import { IMongoDBService } from "./database.inferface";
import { SERVICE_IDENTIFIER } from "../modules/common/consts/service-identifiers.consts";
import { ILogger } from "../modules/common/logger/logger.interface";

@injectable()
export class MongoDBService implements IMongoDBService {
  private mongooseInstance: Mongoose | null = null;

  constructor(
    @inject(SERVICE_IDENTIFIER.ILogger) private logger: ILogger,
    @inject(SERVICE_IDENTIFIER.ConfigService)
    private configService: IConfigService,
  ) {}

  async connect(): Promise<void> {
    try {
      if (!this.mongooseInstance) {
        const uri = this.configService.get("MONGODB_URI");

        if (!uri) {
          throw new Error("MONGODB_URI is not defined in config.");
        }

        this.mongooseInstance = await mongoose.connect(uri, {
          bufferCommands: false,
          autoIndex: true,
          autoCreate: true,
          serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
          },
        });
        this.logger.log("[MongoDBService] Successfully connected to MongoDB.");
      } else {
        this.logger.log("[MongoDBService] Already connected to MongoDB.");
      }
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(
          "[MongoDBService] Error connecting to MongoDB: " + e.message,
        );
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.mongooseInstance) {
      await this.mongooseInstance.disconnect();
      this.logger.log("[MongoDBService] Disconnected from MongoDB.");
    }
  }

  getMongooseInstance(): Mongoose {
    return this.mongooseInstance || ({} as Mongoose);
  }
}
