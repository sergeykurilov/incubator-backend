import { IsString, Length, Matches } from "class-validator";

export interface IBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class BlogDto implements IBlogDto {
  @IsString({ message: "Name must be a string" })
  @Length(1, 15, { message: "Name must be between 1 and 15 characters" })
  name: string;

  @IsString({ message: "Description must be a string" })
  @Length(1, 500, {
    message: "Description must be between 1 and 500 characters",
  })
  description: string;

  @IsString({ message: "Website URL must be a string" })
  @Length(1, 100, {
    message: "Website URL must be between 1 and 100 characters",
  })
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    { message: "Incorrect website URL" },
  )
  websiteUrl: string;
}
