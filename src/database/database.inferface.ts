import { Mongoose } from "mongoose";

export interface IMongoDBService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getMongooseInstance(): Mongoose | null;
}
