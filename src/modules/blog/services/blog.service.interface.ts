import { IBlogDto } from "../controllers/dto/blog.dto";
import { IBlogEntity } from "../entity/blog";

export interface IBlogService {
  findAll: () => Promise<IBlogEntity[]>;
  findById: (id: string) => Promise<IBlogEntity | null>;
  update: (id: string, updateBlogDto: IBlogDto) => Promise<IBlogEntity | null>;
  create: (blog: IBlogDto) => Promise<number>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
