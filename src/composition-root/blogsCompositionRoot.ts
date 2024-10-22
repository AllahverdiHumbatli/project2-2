import {BlogsQueryRepositories} from "../features/blogs/api/blogs-query-repository";
import {BlogsDbRepository} from "../features/blogs/infrastructure/blogs-db-repository";
import {BlogsService} from "../features/blogs/domain/blogs-service";
import {BlogsController} from "../features/blogs/api/controllers/blogsContoller";

export const blogsQueryRepository = new BlogsQueryRepositories()
export const blogsRepository =  new BlogsDbRepository()
export const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsService, blogsQueryRepository )

