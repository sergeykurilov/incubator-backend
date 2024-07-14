import { IVideoRepository } from "./video.repository.interface";
import { videos } from "./db";
import "reflect-metadata";
import { injectable } from "inversify";
import { addDays } from "date-fns/addDays";
import { UpdateVideoType } from "../controllers/dto/update-video.dto";
import { VideoEntity } from "../entity/videos";

@injectable()
export class VideoRepository implements IVideoRepository {
  create(video: Partial<VideoEntity>): Promise<VideoEntity> {
    return new Promise((resolve) => {
      const newId =
        videos.length > 0 ? Math.max(...videos.map((v) => v.id)) + 1 : 1;

      const newVideo = {
        id: newId,
        ...video,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: addDays(new Date(), 1).toISOString(),
      };

      videos.push(<VideoEntity>newVideo);
      resolve(<VideoEntity>newVideo);
    });
  }

  update(
    id: number,
    updatedVideo: UpdateVideoType,
  ): Promise<VideoEntity | null> {
    return new Promise((resolve) => {
      const videoIndex = videos.findIndex((video) => video.id === id);
      if (videoIndex === -1) {
        resolve(null);
      } else {
        videos[videoIndex] = { ...videos[videoIndex], ...updatedVideo };
        resolve(videos[videoIndex]);
      }
    });
  }

  deleteById(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      const videoIndex = videos.findIndex((video) => video.id === id);
      if (videoIndex === -1) {
        resolve(false);
      } else {
        videos.splice(videoIndex, 1);
        resolve(true);
      }
    });
  }

  deleteAll(): Promise<void> {
    return new Promise((resolve) => {
      videos.length = 0;
      resolve();
    });
  }

  findAll(): Promise<VideoEntity[]> {
    return new Promise((resolve) => {
      return resolve(videos);
    });
  }

  findById(id: number): Promise<VideoEntity | null> {
    return new Promise((resolve) => {
      const video = videos.find((video) => video.id === id);
      if (video) {
        resolve(video);
      } else {
        resolve(null);
      }
    });
  }
}
