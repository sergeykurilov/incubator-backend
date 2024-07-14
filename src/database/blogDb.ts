import { IPostEntity } from "../modules/post/entity/post";
import { IBlogEntity } from "../modules/blog/entity/blog";

export type BlogDB = {
  blogs: IBlogEntity[];
  posts: IPostEntity[];
};
export const blogDb: BlogDB = {
  posts: [],
  blogs: [],
};
