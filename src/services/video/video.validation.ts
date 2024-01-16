import {
  AvailableResolution,
  VideoModel,
  ErrorMessage,
} from "../../types/videos";
import { isValid } from "date-fns/isValid";
import { parseISO } from "date-fns/parseISO";
import { CreateVideoDto } from "../../controllers/video/dto/create-video.dto";

export class VideoValidator {
  static error(field: string, message: string): ErrorMessage {
    return { field, message };
  }

  static validatePublicationDate(date: string | null): ErrorMessage | null {
    if (date !== undefined && date !== null) {
      if (typeof date !== "string" || !isValid(parseISO(date))) {
        return this.error(
          "publicationDate",
          "publicationDate must be a valid ISO 8601 date",
        );
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

  static validateCreateVideoInput(videoDto: CreateVideoDto): ErrorMessage[] {
    const errors: ErrorMessage[] = [];

    if (
      !videoDto.title ||
      typeof videoDto.title !== "string" ||
      videoDto.title.trim().length === 0 ||
      videoDto.title.length > 40
    ) {
      errors.push({
        field: "title",
        message:
          "Title is required and must be a string of at most 40 characters",
      });
    }

    if (
      !videoDto.author ||
      typeof videoDto.author !== "string" ||
      videoDto.author.trim().length === 0 ||
      videoDto.author.length > 20
    ) {
      errors.push({
        field: "author",
        message:
          "Author is required and must be a string of at most 20 characters",
      });
    }

    if (
      !Array.isArray(videoDto.availableResolutions) ||
      videoDto.availableResolutions.length === 0 ||
      !videoDto.availableResolutions.every((resolution: AvailableResolution) =>
        [
          AvailableResolution.P144,
          AvailableResolution.P240,
          AvailableResolution.P360,
          AvailableResolution.P480,
          AvailableResolution.P720,
          AvailableResolution.P1080,
          AvailableResolution.P1440,
          AvailableResolution.P2160,
        ].includes(resolution),
      )
    ) {
      errors.push({
        field: "availableResolutions",
        message:
          "At least one valid resolution (P144, P240, P360, P480, P720, P1080, P1440, P2160) should be added",
      });
    }

    return errors;
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
