import { AvailableResolution } from "../../entity/videos";

export interface UpdateVideoType {
  title: string;
  author: string;
  availableResolutions: AvailableResolution[];
}
