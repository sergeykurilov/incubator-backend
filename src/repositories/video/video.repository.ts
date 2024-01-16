import { IVideoRepository } from "./video.repository.interface";
import { VideoModel } from "../../types/videos";
import { videos } from "./db";
import "reflect-metadata";
import { UpdateVideoType } from "../../controllers/video/dto/update-video.dto";
import { injectable } from "inversify";

@injectable()
export class VideoRepository implements IVideoRepository {
  create(video: Partial<VideoModel>): Promise<VideoModel> {
    return new Promise((resolve) => {
      const newId =
        videos.length > 0 ? Math.max(...videos.map((v) => v.id)) + 1 : 1;

      const newVideo = {
        ...video,
        id: newId,
        canBeDownloaded: false,
        minAgeRestriction: null,
      };

      videos.push(<VideoModel>newVideo);
      resolve(<VideoModel>newVideo);
    });
  }

  update(
    id: number,
    updatedVideo: UpdateVideoType,
  ): Promise<VideoModel | null> {
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

  findAll(): Promise<VideoModel[]> {
    return new Promise((resolve) => {
      return resolve(videos);
    });
  }

  findById(id: number): Promise<VideoModel | null> {
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
