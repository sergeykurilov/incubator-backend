import { inject, injectable } from "inversify";
import { SERVICE_IDENTIFIER } from "../../common/consts/service-identifiers.consts";
import { HTTPError } from "../../common/exceptions/http-error";
import { HttpStatusCodes } from "../../common/interfaces/http-status-codes.interface";
import { IPostService } from "./post.service.interface";
import { IPostRepository } from "../repositories/post.repository.interface";
import { IPostEntity } from "../entity/post";
import { IPostDto } from "../controllers/dto/post.dto";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(SERVICE_IDENTIFIER.BlogRepository)
    private blogRepository: IPostRepository,
  ) {}

  findAll(): Promise<IPostEntity[]> {
    return this.blogRepository.findAll();
  }

  deleteAll(): Promise<boolean> {
    return this.blogRepository.deleteAll();
  }

  create(createBlogDto: IPostDto): Promise<IPostEntity> {
    return this.blogRepository.create(createBlogDto);
  }

  async update(
    id: string,
    createBlogDto: IPostDto,
  ): Promise<IPostEntity | null> {
    const blog = await this.blogRepository.findById(id);

    if (!id) {
      throw new HTTPError(HttpStatusCodes.NOT_FOUND, "Not Found", "id");
    }

    if (!createBlogDto) {
      throw new HTTPError(HttpStatusCodes.NOT_FOUND, "Not Found");
    }

    return this.blogRepository.update(id, createBlogDto);
  }

  async findById(id: string): Promise<IPostEntity | null> {
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
