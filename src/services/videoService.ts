import { videos } from "../settings";
import { Video } from "../types/videos";

export const findAllVideos = (): Video[] => {
  return videos;
};

export const findVideoById = (id: number): Video | undefined => {
  return videos.find((v) => v.id === id);
};

export const createVideo = (videoData: Video): Video => {
  const newVideo: Video = {
    ...videoData,
    id: new Date().valueOf(),
    createdAt: new Date().toISOString(),
    publicationDate: new Date(
      new Date().setDate(new Date().getDate() + 1),
    ).toISOString(),
  };
  videos.push(newVideo);
  return newVideo;
};

export const deleteAllVideos = (): void => {
  videos.length = 0;
};
