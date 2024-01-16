import { AvailableResolution, VideoModel } from '../../../types/videos';

export interface CreateVideoDto extends VideoModel {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: AvailableResolution[];
}
