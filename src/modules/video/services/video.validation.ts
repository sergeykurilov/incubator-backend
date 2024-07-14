import { CreateVideoDto } from "../controllers/dto/create-video.dto";
import {
  AvailableResolution,
  ErrorMessage,
  VideoEntity,
} from "../entity/videos";

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
    return [
      ...(this.validateStringField(videoDto.title, "title", 40)
        ? [this.validateStringField(videoDto.title, "title", 40)]
        : []),
      ...(this.validateStringField(videoDto.author, "author", 20)
        ? [this.validateStringField(videoDto.author, "author", 20)]
        : []),
      ...(this.validateArrayContainsValidResolutions(
        videoDto.availableResolutions,
      )
        ? [
            this.validateArrayContainsValidResolutions(
              videoDto.availableResolutions,
            ),
          ]
        : []),
    ].filter(Boolean) as ErrorMessage[];
  }

  static validateUpdateVideo(video: Partial<VideoEntity>): ErrorMessage[] {
    return [
      ...(this.validateStringField(video.title, "title", 40)
        ? [this.validateStringField(video.title, "title", 40)]
        : []),
      ...(this.validatePublicationDate(video.publicationDate)
        ? [this.validatePublicationDate(video.publicationDate)]
        : []),
      ...(this.validateBooleanField(video.canBeDownloaded, "canBeDownloaded")
        ? [this.validateBooleanField(video.canBeDownloaded, "canBeDownloaded")]
        : []),
      ...(this.validateStringField(video.author, "author", 20)
        ? [this.validateStringField(video.author, "author", 20)]
        : []),
      ...(video.availableResolutions &&
      this.validateArrayContainsValidResolutions(video.availableResolutions)
        ? [
            this.validateArrayContainsValidResolutions(
              video.availableResolutions,
            ),
          ]
        : []),
      ...(this.validateMinAgeRestriction(video.minAgeRestriction)
        ? [this.validateMinAgeRestriction(video.minAgeRestriction)]
        : []),
    ].filter(Boolean) as ErrorMessage[];
  }
}
