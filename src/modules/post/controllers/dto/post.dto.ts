import { IsString, Length } from "class-validator";

export class PostDto {
  @IsString({ message: "Title must be a string" })
  @Length(1, 30, { message: "Title must be between 1 and 30 characters" })
  title: string;

  @IsString({ message: "Short description must be a string" })
  @Length(1, 100, {
    message: "Short description must be between 1 and 100 characters",
  })
  shortDescription: string;

  @IsString({ message: "Content must be a string" })
  @Length(1, 1000, { message: "Content must be between 1 and 1000 characters" })
  content: string;

  @IsString({ message: "Blog ID must be a string" })
  blogId: string;
}
