import {
  AvailableResolution,
  VideoModel,
  ErrorMessage,
} from "../../types/videos";
import { isValid } from "date-fns/isValid";
import { parseISO } from "date-fns/parseISO";

export class VideoValidator {
  static error(field: string, message: string): ErrorMessage {
    return { field, message };
  }

  static validatePublicationDate(date: string | null): ErrorMessage | null {
    if (date !== undefined && date !== null) {
      if (typeof date !== "string" || !isValid(parseISO(date))) {
        return this.error("publicationDate", "Invalid publicationDate");
      }
    }

    return null;
  }

  static validateCanBeDownloaded(
    canBeDownloaded: boolean,
  ): ErrorMessage | null {
    if (canBeDownloaded !== undefined && typeof canBeDownloaded !== "boolean") {
      return this.error("canBeDownloaded", "canBeDownloaded must be a boolean");
    }
    return null;
  }

  static validateTitle(title: string): ErrorMessage | null {
    if (!title || typeof title !== "string" || title.trim().length > 40) {
      return this.error("title", "Incorrect Title");
    }
    return null;
  }

  static validateAuthor(author: string): ErrorMessage | null {
    if (!author || typeof author !== "string" || author.trim().length > 20) {
      return this.error("author", "Incorrect Author");
    }
    return null;
  }

  static validateAvailableResolutions(
    resolutions: AvailableResolution[],
  ): ErrorMessage | null {
    if (!Array.isArray(resolutions)) {
      return this.error(
        "availableResolutions",
        "Incorrect availableResolutions",
      );
    }
    const invalidResolution = resolutions.find(
      (resolution) => !AvailableResolution[resolution],
    );
    if (invalidResolution) {
      return this.error(
        "availableResolutions",
        "Invalid availableResolutions value",
      );
    }

    return null;
  }

  static validateMinAgeRestriction(age: number | null): ErrorMessage | null {
    if (age !== undefined && (typeof age !== "number" || age < 0)) {
      return this.error("minAgeRestriction", "Invalid minAgeRestriction");
    }

    return null;
  }

  static validateCreateVideo(video: VideoModel): ErrorMessage[] {
    const errorMessages = [
      this.validateCanBeDownloaded(video.canBeDownloaded),
      this.validateTitle(video.title),
      this.validateAuthor(video.author),
      this.validateAvailableResolutions(video.availableResolutions),
      this.validateMinAgeRestriction(video.minAgeRestriction),
    ].filter((error) => error !== null) as ErrorMessage[];

    return errorMessages;
  }

  static validateUpdateVideo(video: Partial<VideoModel>): ErrorMessage[] {
    const errorMessages: ErrorMessage[] = [];

    if (!!video.canBeDownloaded) {
      const canBeDownloadedError = this.validateCanBeDownloaded(
        video.canBeDownloaded,
      );
      if (canBeDownloadedError) {
        errorMessages.push(canBeDownloadedError);
      }
    }

    if (!!video.title) {
      const titleError = this.validateTitle(video.title);
      if (titleError) {
        errorMessages.push(titleError);
      }
    }

    if (video.author) {
      const authorError = this.validateAuthor(video.author);
      if (authorError) {
        errorMessages.push(authorError);
      }
    }

    if (!!video.availableResolutions) {
      const availableResolutionsError = this.validateAvailableResolutions(
        video.availableResolutions,
      );
      if (availableResolutionsError) {
        errorMessages.push(availableResolutionsError);
      }
    }

    if (!!video.minAgeRestriction) {
      const minAgeRestrictionError = this.validateMinAgeRestriction(
        video.minAgeRestriction,
      );

      if (minAgeRestrictionError) {
        errorMessages.push(minAgeRestrictionError);
      }
    }

    if (!!video.publicationDate) {
      const publicationDateError = this.validatePublicationDate(
        video.publicationDate,
      );

      if (publicationDateError) {
        errorMessages.push(publicationDateError);
      }
    }

    return errorMessages.filter((error) => error !== null) as ErrorMessage[];
  }
}
