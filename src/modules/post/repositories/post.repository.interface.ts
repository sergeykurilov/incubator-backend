import { IPostEntity } from "../entity/post";
import { IPostDto } from "../controllers/dto/post.dto";

export interface IPostRepository {
  findAll: () => Promise<IPostEntity[]>;
  findById: (id: string) => Promise<IPostEntity | null>;
  create: (createBlogDto: IPostDto) => Promise<IPostEntity>;
  update: (id: string, updateBlogDto: IPostDto) => Promise<IPostEntity | null>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
