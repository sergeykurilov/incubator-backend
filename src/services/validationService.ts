import { AvailableResolution, CreateVideoType } from "../types/videos";

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
  const { title, author, availableResolutions } = reqBody;

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

  return errors.errorMessages.length ? errors : null;
};
