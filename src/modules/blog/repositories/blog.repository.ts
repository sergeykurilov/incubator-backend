import "reflect-metadata";
import { injectable } from "inversify";
import { IBlogRepository } from "./blog.repository.interface";
import { IBlogEntity } from "../entity/blog";
import { blogDb } from "../../../database/blogDb";
import { HttpStatusCodes } from "../../common/interfaces/http-status-codes.interface";
import { BlogDto } from "../controllers/dto/blog.dto";

@injectable()
export class BlogRepository implements IBlogRepository {
  findAll(): Promise<IBlogEntity[]> {
    return new Promise((resolve) => {
      return resolve(blogDb.blogs);
    });
  }

  findById(id: string): Promise<IBlogEntity | null> {
    return new Promise((resolve) => {
      const blog = blogDb.blogs.find((blog) => blog.id === id);
      resolve(blog || null);
    });
  }

  deleteById(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const blog = blogDb.blogs.find((blog) => blog.id === id);

      if (!blog) {
        resolve(false);
      }

      blogDb.blogs = blogDb.blogs.filter((blog) => blog.id !== id);
      resolve(true);
    });
  }

  create(createBlogDto: BlogDto): Promise<number> {
    const lastBlog = blogDb.blogs[blogDb.blogs.length - 1];
    const newBlogId = lastBlog ? String(Number(lastBlog.id) + 1) : "0";

    const newBlog: IBlogEntity = {
      id: newBlogId,
      ...createBlogDto,
    };

    return new Promise((resolve) => {
      blogDb.blogs.push(newBlog);
      resolve(HttpStatusCodes.CREATED);
    });
  }

  deleteAll(): Promise<boolean> {
    return new Promise((resolve) => {
      blogDb.blogs = [];
      resolve(true);
    });
  }

  update(id: string, updateBlogDto: BlogDto): Promise<IBlogEntity | null> {
    return new Promise((resolve, reject) => {
      let updatedBlog: IBlogEntity | undefined;

      blogDb.blogs.forEach((blog, index) => {
        if (blog.id === id) {
          blogDb.blogs[index] = { id, ...updateBlogDto };
          updatedBlog = blogDb.blogs[index];
        }
      });

      if (updatedBlog) {
        resolve(updatedBlog);
      } else {
        reject(null);
      }
    });
  }
}
