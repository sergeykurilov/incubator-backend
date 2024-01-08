import { AvailableResolution, CreateVideoType, Video } from "../types/videos";

interface ErrorMessage {
  field: string;
  message: string;
}

interface ErrorType {
  errorMessages: ErrorMessage[];
}

export const validateVideoInput = (
  reqBody: CreateVideoType,
): ErrorType | null => {
  const errors: ErrorType = { errorMessages: [] };
  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
  } = reqBody as Video;

  if (canBeDownloaded !== undefined && typeof canBeDownloaded !== "boolean") {
    errors.errorMessages.push({
      field: "canBeDownloaded",
      message: "canBeDownloaded must be a boolean",
    });
  }

  if (!title || typeof title !== "string" || title.trim().length > 40) {
    errors.errorMessages.push({
      field: "title",
      message: "Incorrect Title",
    });
  }

  if (!author || typeof author !== "string" || author.trim().length > 20) {
    errors.errorMessages.push({
      field: "author",
      message: "Incorrect Author",
    });
  }

  if (!Array.isArray(availableResolutions)) {
    errors.errorMessages.push({
      field: "availableResolutions",
      message: "Incorrect availableResolutions",
    });
  } else {
    availableResolutions.forEach((resolution) => {
      if (!AvailableResolution[resolution]) {
        errors.errorMessages.push({
          field: "availableResolutions",
          message: "Invalid availableResolutions value",
        });
      }
    });
  }

  if (
    minAgeRestriction !== undefined &&
    (typeof minAgeRestriction !== "number" || minAgeRestriction < 0)
  ) {
    errors.errorMessages.push({
      field: "minAgeRestriction",
      message: "minAgeRestriction must be a non-negative number",
    });
  }

  return errors.errorMessages.length ? errors : null;
};
