import { inject, injectable } from "inversify";
import {
  IReturnVideoServiceType,
  IVideoService,
} from "./video.service.interface";
import { VideoValidator } from "./video.validation";
import { IVideoRepository } from "../repositories/video.repository.interface";
import { CreateVideoDto } from "../controllers/dto/create-video.dto";
import { UpdateVideoType } from "../controllers/dto/update-video.dto";
import { VideoEntity } from "../entity/videos";
import { SERVICE_IDENTIFIER } from "../../common/consts/service-identifiers.consts";

@injectable()
export class VideoService implements IVideoService {
  constructor(
    @inject(SERVICE_IDENTIFIER.VideoRepository)
    private videoRepository: IVideoRepository,
  ) {}

  async createVideo(
    videoDto: CreateVideoDto,
  ): Promise<IReturnVideoServiceType> {
    try {
      const errors = VideoValidator.validateCreateVideoInput(videoDto);

      if (errors.length) {
        return {
          errors,
          video: null,
        };
      }

      return {
        errors,
        video: await this.videoRepository.create(videoDto),
      };
    } catch (error) {
      throw new Error(`Error while creating video`);
    }
  }

  deleteAll(): Promise<void> {
    try {
      return this.videoRepository.deleteAll();
    } catch (e) {
      throw new Error(`Error while deleting videos`);
    }
  }

  deleteById(id: number): Promise<boolean> {
    return this.videoRepository.deleteById(id);
  }

  findAll(): Promise<VideoEntity[]> {
    try {
      return this.videoRepository.findAll();
    } catch (e) {
      throw new Error(`Error while searching for videos`);
    }
  }

  findById(id: number): Promise<VideoEntity | null> {
    try {
      return this.videoRepository.findById(id);
    } catch (e) {
      throw new Error(`Error while searching for videos`);
    }
  }

  async updateVideo(
    id: number,
    updatedVideo: UpdateVideoType,
  ): Promise<IReturnVideoServiceType> {
    try {
      const errors = VideoValidator.validateUpdateVideo(updatedVideo);
      const video = await this.videoRepository.findById(id);

      if (errors.length) {
        return {
          errors,
          video: null,
          isVideo: Boolean(video),
        };
      }

      return {
        errors,
        video: await this.videoRepository.update(id, updatedVideo),
        isVideo: Boolean(await this.videoRepository.findById(id)),
      };
    } catch (error) {
      throw new Error(`Error while updating video`);
    }
  }
}
