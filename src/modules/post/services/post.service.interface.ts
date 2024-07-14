import { IPostEntity } from "../entity/post";
import { PostDto } from "../controllers/dto/post.dto";

export interface IPostService {
  findAll: () => Promise<IPostEntity[]>;
  findById: (id: string) => Promise<IPostEntity | null>;
  update: (id: string, updateBlogDto: PostDto) => Promise<IPostEntity | null>;
  create: (video: PostDto) => Promise<IPostEntity>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
