"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDto = void 0;
const class_validator_1 = require("class-validator");
class PostDto {
}
exports.PostDto = PostDto;
__decorate([
    (0, class_validator_1.IsString)({ message: "Title must be a string" }),
    (0, class_validator_1.Length)(1, 30, { message: "Title must be between 1 and 30 characters" }),
    __metadata("design:type", String)
], PostDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Short description must be a string" }),
    (0, class_validator_1.Length)(1, 100, {
        message: "Short description must be between 1 and 100 characters",
    }),
    __metadata("design:type", String)
], PostDto.prototype, "shortDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Content must be a string" }),
    (0, class_validator_1.Length)(1, 1000, { message: "Content must be between 1 and 1000 characters" }),
    __metadata("design:type", String)
], PostDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Blog ID must be a string" }),
    __metadata("design:type", String)
], PostDto.prototype, "blogId", void 0);
