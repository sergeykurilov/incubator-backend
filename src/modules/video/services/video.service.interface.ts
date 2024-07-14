import { UpdateVideoType } from "../controllers/dto/update-video.dto";
import { CreateVideoDto } from "../controllers/dto/create-video.dto";
import { ErrorMessage, VideoEntity } from "../entity/videos";

export type IReturnVideoServiceType = {
  errors: ErrorMessage[];
  video: VideoEntity | null;
  isVideo?: boolean;
};

export interface IVideoService {
  updateVideo: (
    id: number,
    updatedVideo: UpdateVideoType,
  ) => Promise<IReturnVideoServiceType>;
  createVideo: (video: CreateVideoDto) => Promise<IReturnVideoServiceType>;
  findAll: () => Promise<VideoEntity[]>;
  findById: (id: number) => Promise<VideoEntity | null>;
  deleteById: (id: number) => Promise<boolean>;
  deleteAll: () => Promise<void>;
}
