import "reflect-metadata";
import { injectable } from "inversify";
import { IPostEntity } from "../entity/post";
import { IPostRepository } from "./post.repository.interface";
import { blogDb } from "../../../database/blogDb";
import { PostDto } from "../controllers/dto/post.dto";

@injectable()
export class PostRepository implements IPostRepository {
  findAll(): Promise<IPostEntity[]> {
    return new Promise((resolve) => {
      return resolve(blogDb.posts);
    });
  }

  findById(id: string): Promise<IPostEntity | null> {
    return new Promise((resolve) => {
      const post = blogDb.posts.find((blog) => blog.id === id);
      resolve(post || null);
    });
  }

  deleteById(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const post = blogDb.posts.find((blog) => blog.id === id);

      if (!post) {
        resolve(false);
      }

      blogDb.posts = blogDb.posts.filter((blog) => blog.id !== id);
      resolve(true);
    });
  }

  create(createPostDto: PostDto): Promise<IPostEntity> {
    const lastPost = blogDb.posts[blogDb.posts.length - 1];
    const newPostId = lastPost ? String(Number(lastPost.id) + 1) : "0";

    const newPost: IPostEntity = {
      id: newPostId,
      ...createPostDto,
    };

    return new Promise((resolve) => {
      blogDb.posts.push(newPost);
      resolve(newPost);
    });
  }

  deleteAll(): Promise<boolean> {
    return new Promise((resolve) => {
      blogDb.posts = [];
      resolve(true);
    });
  }

  update(id: string, updatePostDto: PostDto): Promise<IPostEntity | null> {
    return new Promise((resolve, reject) => {
      let updatedPost: IPostEntity | undefined;

      blogDb.blogs.forEach((blog, index) => {
        if (blog.id === id) {
          blogDb.posts[index] = { id, ...updatePostDto };
          updatedPost = blogDb.posts[index];
        }
      });

      if (updatedPost) {
        resolve(updatedPost);
      } else {
        reject(null);
      }
    });
  }
}
