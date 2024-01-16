import { ErrorMessage, VideoModel } from "../../types/videos";
import { CreateVideoDto } from "../../controllers/video/dto/create-video.dto";
import { UpdateVideoType } from "../../controllers/video/dto/update-video.dto";

export type IUpdateVideoServiceType = {
  errors: ErrorMessage[];
  video: VideoModel | null;
};

export interface IVideoService {
  updateVideo: (
    id: number,
    updatedVideo: UpdateVideoType,
  ) => Promise<IUpdateVideoServiceType>;
  createVideo: (video: CreateVideoDto) => Promise<VideoModel | ErrorMessage[]>;
  findAll: () => Promise<VideoModel[]>;
  findById: (id: number) => Promise<VideoModel | null>;
  deleteById: (id: number) => Promise<boolean>;
  deleteAll: () => Promise<void>;
}
