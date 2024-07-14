import { IBlogDto } from "../controllers/dto/blog.dto";
import { IBlogEntity } from "../entity/blog";

export interface IBlogRepository {
  findAll: () => Promise<IBlogEntity[]>;
  findById: (id: string) => Promise<IBlogEntity | null>;
  create: (createBlogDto: IBlogDto) => Promise<number>;
  update: (id: string, updateBlogDto: IBlogDto) => Promise<IBlogEntity | null>;
  deleteById: (id: string) => Promise<boolean>;
  deleteAll: () => Promise<boolean>;
}
