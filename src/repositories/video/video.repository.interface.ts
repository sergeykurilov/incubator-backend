import { VideoModel } from "../../types/videos";
import { UpdateVideoType } from "../../controllers/video/dto/update-video.dto";

export interface IVideoRepository {
  create: (video: VideoModel) => Promise<VideoModel>;
  update: (
    id: number,
    updatedVideo: UpdateVideoType,
  ) => Promise<VideoModel | null>;
  findAll: () => Promise<VideoModel[]>;
  findById: (id: number) => Promise<VideoModel | null>;
  deleteById: (id: number) => Promise<boolean>;
  deleteAll: () => Promise<void>;
}
