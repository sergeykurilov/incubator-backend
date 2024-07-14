import { IBlogEntity } from "../entity/blog";
import { BlogDto } from "../controllers/dto/blog.dto";

export interface IBlogService {
  findAll: () => Promise<IBlogEntity[]>;
  findById: (id: string) => Promise<IBlogEntity | null>;
  update: (id: string, updateBlogDto: BlogDto) => Promise<IBlogEntity | null>;
  create: (blog: BlogDto) => Promise<number>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
