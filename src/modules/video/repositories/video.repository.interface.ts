import { UpdateVideoType } from "../controllers/dto/update-video.dto";
import { VideoEntity } from "../entity/videos";

export interface IVideoRepository {
  create: (video: VideoEntity) => Promise<VideoEntity>;
  update: (
    id: number,
    updatedVideo: UpdateVideoType,
  ) => Promise<VideoEntity | null>;
  findAll: () => Promise<VideoEntity[]>;
  findById: (id: number) => Promise<VideoEntity | null>;
  deleteById: (id: number) => Promise<boolean>;
  deleteAll: () => Promise<void>;
}
