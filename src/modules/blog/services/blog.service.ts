import { inject, injectable } from "inversify";
import { IBlogService } from "./blog.service.interface";
import { IBlogRepository } from "../repositories/blog.repository.interface";
import { IBlogEntity } from "../entity/blog";
import { SERVICE_IDENTIFIER } from "../../common/consts/service-identifiers.consts";
import { IBlogDto } from "../controllers/dto/blog.dto";
import { HTTPError } from "../../common/exceptions/http-error";
import { HttpStatusCodes } from "../../common/interfaces/http-status-codes.interface";

@injectable()
export class BlogService implements IBlogService {
  constructor(
    @inject(SERVICE_IDENTIFIER.BlogRepository)
    private blogRepository: IBlogRepository,
  ) {}

  findAll(): Promise<IBlogEntity[]> {
    return this.blogRepository.findAll();
  }

  create(createBlogDto: IBlogDto): Promise<number> {
    return this.blogRepository.create(createBlogDto);
  }

  deleteAll(): Promise<boolean> {
    return this.blogRepository.deleteAll();
  }

  async update(
    id: string,
    createBlogDto: IBlogDto,
  ): Promise<IBlogEntity | null> {
    const blog = await this.blogRepository.findById(id);

    if (!id) {
      throw new HTTPError(HttpStatusCodes.NOT_FOUND, "Not Found", "id");
    }

    if (!createBlogDto) {
      throw new HTTPError(HttpStatusCodes.NOT_FOUND, "Not Found");
    }

    return this.blogRepository.update(id, createBlogDto);
  }

  async findById(id: string): Promise<IBlogEntity | null> {
    const blog = await this.blogRepository.findById(id);

    if (!blog || !blog.id) {
      throw new HTTPError(HttpStatusCodes.NOT_FOUND, "Not Found", "id");
    }

    return blog;
  }

  async deleteById(id: string): Promise<boolean> {
    const blog = await this.blogRepository.deleteById(id);

    if (!blog) {
      throw new HTTPError(HttpStatusCodes.NOT_FOUND, "Not Found", "id");
    }

    return blog;
  }
}
