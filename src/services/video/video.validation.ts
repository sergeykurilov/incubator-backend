import {
  AvailableResolution,
  VideoModel,
  ErrorMessage,
} from "../../types/videos";
import { CreateVideoDto } from "../../controllers/video/dto/create-video.dto";

export class VideoValidator {
  static error(field: string, message: string): ErrorMessage {
    return { field, message };
  }

  static isStringWithLength(
    value: string | null | undefined,
    maxLength: number,
  ): boolean {
    return (
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.length <= maxLength
    );
  }

  static validateStringField(
    value: string | null | undefined,
    field: string,
    maxLength: number,
  ): ErrorMessage | null {
    if (!this.isStringWithLength(value, maxLength)) {
      return this.error(field, `Incorrect ${field}`);
    }
    return null;
  }

  static validatePublicationDate(date?: string | null): ErrorMessage | null {
    const isoDateRegex =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;
    if (date && !isoDateRegex.test(date)) {
      return this.error(
        "publicationDate",
        "publicationDate must be a valid ISO 8601 date",
      );
    }
    return null;
  }

  static validateBooleanField(
    value: boolean | undefined,
    field: string,
  ): ErrorMessage | null {
    if (value !== undefined && typeof value !== "boolean") {
      return this.error(field, `${field} must be a boolean`);
    }
    return null;
  }

  static validateArrayContainsValidResolutions(
    resolutions: AvailableResolution[],
  ): ErrorMessage | null {
    if (
      !Array.isArray(resolutions) ||
      resolutions.some((r) => !AvailableResolution[r])
    ) {
      return this.error(
        "availableResolutions",
        "Invalid availableResolutions value",
      );
    }
    return null;
  }

  static validateMinAgeRestriction(age?: number | null): ErrorMessage | null {
    if (age !== null && (typeof age !== "number" || age < 1 || age > 18)) {
      return this.error("minAgeRestriction", "Invalid minAgeRestriction");
    }
    return null;
  }

  static validateCreateVideoInput(videoDto: CreateVideoDto): ErrorMessage[] {
    const errors: ErrorMessage[] = [];

    const titleError = this.validateStringField(videoDto.title, "title", 40);
    if (titleError) errors.push(titleError);

    const authorError = this.validateStringField(videoDto.author, "author", 20);
    if (authorError) errors.push(authorError);

    const availableResolutionsError =
      this.validateArrayContainsValidResolutions(videoDto.availableResolutions);
    if (availableResolutionsError) errors.push(availableResolutionsError);

    return errors;
  }

  static validateUpdateVideo(video: Partial<VideoModel>): ErrorMessage[] {
    const errors: ErrorMessage[] = [];

    const titleError = this.validateStringField(video.title, "title", 40);
    if (titleError) errors.push(titleError);

    const publicationDateError = this.validatePublicationDate(
      video.publicationDate,
    );
    if (publicationDateError) errors.push(publicationDateError);

    const canBeDownloadedError = this.validateBooleanField(
      video.canBeDownloaded,
      "canBeDownloaded",
    );
    if (canBeDownloadedError) errors.push(canBeDownloadedError);

    const authorError = this.validateStringField(video.author, "author", 20);
    if (authorError) errors.push(authorError);

    const availableResolutionsError =
      video.availableResolutions &&
      this.validateArrayContainsValidResolutions(video.availableResolutions);
    if (availableResolutionsError) errors.push(availableResolutionsError);

    const minAgeRestrictionError = this.validateMinAgeRestriction(
      video.minAgeRestriction,
    );
    if (minAgeRestrictionError) errors.push(minAgeRestrictionError);

    return errors;
  }
}
