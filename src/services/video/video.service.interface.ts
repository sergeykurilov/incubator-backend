import { ErrorMessage, VideoModel } from "../../types/videos";
import { CreateVideoDto } from "../../controllers/video/dto/create-video.dto";
import { UpdateVideoType } from "../../controllers/video/dto/update-video.dto";

export interface IVideoService {
  updateVideo: (
    id: number,
    updatedVideo: UpdateVideoType,
  ) => Promise<VideoModel | ErrorMessage[] | null>;
  createVideo: (video: CreateVideoDto) => Promise<VideoModel | ErrorMessage[]>;
  findAll: () => Promise<VideoModel[]>;
  findById: (id: number) => Promise<VideoModel | null>;
  deleteById: (id: number) => Promise<boolean>;
  deleteAll: () => Promise<void>;
}
