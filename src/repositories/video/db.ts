import { AvailableResolution, VideoModel } from "../../types/videos";

export const videos: VideoModel[] = [
  {
    id: 0,
    title: "title",
    author: "author",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2024-01-02T15:40:19.154Z",
    publicationDate: "2024-01-02T15:40:19.154Z",
    availableResolutions: [AvailableResolution.P144],
  },
];
