"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoValidator = void 0;
const videos_1 = require("../../types/videos");
const isValid_1 = require("date-fns/isValid");
const parseISO_1 = require("date-fns/parseISO");
class VideoValidator {
    static error(field, message) {
        return { field, message };
    }
    static validatePublicationDate(date) {
        if (date !== undefined && date !== null) {
            if (typeof date !== "string" || !(0, isValid_1.isValid)((0, parseISO_1.parseISO)(date))) {
                return this.error("publicationDate", "Invalid publicationDate");
            }
        }
        return null;
    }
    static validateCanBeDownloaded(canBeDownloaded) {
        if (canBeDownloaded !== undefined && typeof canBeDownloaded !== "boolean") {
            return this.error("canBeDownloaded", "canBeDownloaded must be a boolean");
        }
        return null;
    }
    static validateTitle(title) {
        if (!title || typeof title !== "string" || title.trim().length > 40) {
            return this.error("title", "Incorrect Title");
        }
        return null;
    }
    static validateAuthor(author) {
        if (!author || typeof author !== "string" || author.trim().length > 20) {
            return this.error("author", "Incorrect Author");
        }
        return null;
    }
    static validateAvailableResolutions(resolutions) {
        if (!Array.isArray(resolutions)) {
            return this.error("availableResolutions", "Incorrect availableResolutions");
        }
        const invalidResolution = resolutions.find((resolution) => !videos_1.AvailableResolution[resolution]);
        if (invalidResolution) {
            return this.error("availableResolutions", "Invalid availableResolutions value");
        }
        return null;
    }
    static validateMinAgeRestriction(age) {
        if (age !== undefined && (typeof age !== "number" || age < 0)) {
            return this.error("minAgeRestriction", "Invalid minAgeRestriction");
        }
        return null;
    }
    static validateCreateVideo(video) {
        const errorMessages = [
            this.validateCanBeDownloaded(video.canBeDownloaded),
            this.validateTitle(video.title),
            this.validateAuthor(video.author),
            this.validateAvailableResolutions(video.availableResolutions),
            this.validateMinAgeRestriction(video.minAgeRestriction),
        ].filter((error) => error !== null);
        return errorMessages;
    }
    static validateUpdateVideo(video) {
        const errorMessages = [];
        if (!!video.canBeDownloaded) {
            const canBeDownloadedError = this.validateCanBeDownloaded(video.canBeDownloaded);
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
            const availableResolutionsError = this.validateAvailableResolutions(video.availableResolutions);
            if (availableResolutionsError) {
                errorMessages.push(availableResolutionsError);
            }
        }
        if (!!video.minAgeRestriction) {
            const minAgeRestrictionError = this.validateMinAgeRestriction(video.minAgeRestriction);
            if (minAgeRestrictionError) {
                errorMessages.push(minAgeRestrictionError);
            }
        }
        if (!!video.publicationDate) {
            const publicationDateError = this.validatePublicationDate(video.publicationDate);
            if (publicationDateError) {
                errorMessages.push(publicationDateError);
            }
        }
        return errorMessages.filter((error) => error !== null);
    }
}
exports.VideoValidator = VideoValidator;
