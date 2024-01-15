import { AvailableResolution } from "../../../types/videos";

export interface UpdateVideoType {
  title: string;
  author: string;
  availableResolutions: AvailableResolution[];
}
