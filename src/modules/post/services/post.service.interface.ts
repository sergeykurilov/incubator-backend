import { IPostEntity } from "../entity/post";
import { IPostDto } from "../controllers/dto/post.dto";

export interface IPostService {
  findAll: () => Promise<IPostEntity[]>;
  findById: (id: string) => Promise<IPostEntity | null>;
  update: (id: string, updateBlogDto: IPostDto) => Promise<IPostEntity | null>;
  create: (video: IPostDto) => Promise<IPostEntity>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
