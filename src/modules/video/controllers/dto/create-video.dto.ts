import { AvailableResolution, VideoEntity } from "../../entity/videos";

export interface CreateVideoDto extends VideoEntity {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: AvailableResolution[];
}
