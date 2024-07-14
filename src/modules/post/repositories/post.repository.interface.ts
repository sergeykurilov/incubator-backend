import { IPostEntity } from "../entity/post";
import { PostDto } from "../controllers/dto/post.dto";

export interface IPostRepository {
  findAll: () => Promise<IPostEntity[]>;
  findById: (id: string) => Promise<IPostEntity | null>;
  create: (createBlogDto: PostDto) => Promise<IPostEntity>;
  update: (id: string, updateBlogDto: PostDto) => Promise<IPostEntity | null>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
