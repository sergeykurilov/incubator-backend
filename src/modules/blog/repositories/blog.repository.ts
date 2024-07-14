import "reflect-metadata";
import { injectable } from "inversify";
import { IBlogRepository } from "./blog.repository.interface";
import { IBlogEntity } from "../entity/blog";
import { blogDb } from "../../../database/blogDb";
import { IBlogDto } from "../controllers/dto/blog.dto";
import { HttpStatusCodes } from "../../common/interfaces/http-status-codes.interface";

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

  create(createBlogDto: IBlogDto): Promise<number> {
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

  deleteAll(): Promise<void> {
    return new Promise((resolve) => {
      blogDb.blogs = [];
      resolve();
    });
  }

  update(id: string, updateBlogDto: IBlogDto): Promise<IBlogEntity | null> {
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
