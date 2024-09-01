
import {Request, Response} from 'express'
import {blogsRepositories} from "../../infrastructure/blogs-db-repository";
import {blogsService} from "../../domain/blogs-service";

export const updateBlogById = async (req: Request, res: Response) => {

    const updatedBlog:boolean = await blogsService.updateById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
    if(updatedBlog) {
        res.sendStatus(204)
        return
    }else
    res.sendStatus(404)
    return
}


