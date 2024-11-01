import {Request, Response} from "express";
import {BlogsService} from "../../domain/blogs-service";
import {BlogsQueryViewModel, BlogViewModel} from "../view-models/blogsViewModels";
import {BlogsQueryRepositories} from "../blogs-query-repository";


export class BlogsController {

    constructor(
        protected blogsService : BlogsService,
        protected blogsQueryRepository: BlogsQueryRepositories
    ){}

    async postController (req: Request, res: Response) {

        const newBlogId = await this.blogsService.postBlog(req.body.name, req.body.description, req.body.websiteUrl)
        const createdBlog: BlogViewModel = await this.blogsQueryRepository.getById(newBlogId)
        res.status(201).send(createdBlog)
}
     helperForBlogPagination(query: {[key: string]: string| undefined }) :BlogsQueryViewModel  {

        const sortDirection = (query.sortDirection === 'asc' || query.sortDirection === 'desc')
            ? query.sortDirection
            : 'desc';
        return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: sortDirection,
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
}
}
    async getAllBlogs (req: Request, res: Response<any>)   {
        console.log('get all blogs')
        const sanitizedQuery = this.helperForBlogPagination(req.query as {[key: string]: string| undefined})
        const allBlogs = await this.blogsQueryRepository.getBlogs(sanitizedQuery)
        res.status(200).send(allBlogs)
}
    async getBlogById (req: Request, res: Response)  {
        let blog :BlogViewModel = await this.blogsQueryRepository.getById(req.params.id)
            if (blog) {
            res.status(200).send(blog)
            return
        }
        res.sendStatus(404)
        return
    }
    async deleteBlogById (req: Request, res: Response) {
        const isDeleted = await this.blogsService.deleteById(req.params.id)
        {
            if (isDeleted) {
                return res.sendStatus(204)
            }
            return res.sendStatus(404)
        }
    }
     async updateBlogById (req: Request, res: Response) {

        const updatedBlog:boolean = await this.blogsService.updateById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
            if(updatedBlog) {
                res.sendStatus(204)
                return
            }else
                res.sendStatus(404)
            return
        }
}


// const method = blogsController.getBlogsController
//
// const obj = {
//     method2(callback){
//         callback()
//     }
// }

