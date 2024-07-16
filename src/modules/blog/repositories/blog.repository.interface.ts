import { IBlogEntity } from "../entity/blog";
import { BlogDto } from "../controllers/dto/blog.dto";

export interface IBlogRepository {
  findAll: () => Promise<IBlogEntity[]>;
  findById: (id: string) => Promise<IBlogEntity | null>;
  create: (createBlogDto: BlogDto) => Promise<IBlogEntity>;
  update: (id: string, updateBlogDto: BlogDto) => Promise<IBlogEntity | null>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
