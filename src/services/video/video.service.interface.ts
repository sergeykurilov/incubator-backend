import { ErrorMessage, VideoModel } from "../../types/videos";
import { CreateVideoDto } from "../../controllers/video/dto/create-video.dto";
import { UpdateVideoType } from "../../controllers/video/dto/update-video.dto";

export type IReturnVideoServiceType = {
  errors: ErrorMessage[];
  video: VideoModel | null;
  isVideo?: boolean;
};

export interface IVideoService {
  updateVideo: (
    id: number,
    updatedVideo: UpdateVideoType,
  ) => Promise<IReturnVideoServiceType>;
  createVideo: (video: CreateVideoDto) => Promise<IReturnVideoServiceType>;
  findAll: () => Promise<VideoModel[]>;
  findById: (id: number) => Promise<VideoModel | null>;
  deleteById: (id: number) => Promise<boolean>;
  deleteAll: () => Promise<void>;
}
