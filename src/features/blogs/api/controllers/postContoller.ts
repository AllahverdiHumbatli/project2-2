// import {Request, Response} from 'express'
// import {blogsRepositories} from "../../infrastructure/blogs-db-repository";
// import {blogsService} from "../../domain/blogs-service";
// import {blogsQueryRepositories} from "../blogs-query-repository";
// import {BlogViewModel} from "../view-models/blogsViewModels";
// export const postContoller = async (req: Request, res: Response) => {
//
//     const newBlogId = await blogsService.postBlog(req.body.name, req.body.description, req.body.websiteUrl)
//     const createdBlog: BlogViewModel = await blogsQueryRepositories.getById(newBlogId)
//     res.status(201).send(createdBlog)
// }