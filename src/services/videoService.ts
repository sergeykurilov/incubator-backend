import { videos } from "../settings";
import { CreateVideoType, Video } from "../types/videos";

export const findAllVideos = (): Video[] => {
  return videos;
};

export const deleteVideoById = (id: number): boolean => {
  const index = videos.findIndex((v) => v.id === id);

  if (index !== -1) {
    videos.splice(index, 1);
    return true;
  }

  return false;
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

export const updateVideoById = (
  id: number,
  videoData: CreateVideoType,
): Video | boolean => {
  const index = videos.findIndex((v) => v.id === id);

  if (index !== -1) {
    const updatedVideo = { ...videos[index], ...videoData };
    videos[index] = updatedVideo;
    return updatedVideo;
  }

  return false;
};
