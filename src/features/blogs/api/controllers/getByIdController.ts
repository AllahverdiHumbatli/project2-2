import {Request, Response} from 'express'
import {blogsRepositories} from "../../infrastructure/blogs-db-repository";
import {blogsService} from "../../domain/blogs-service";
import {blogsQueryRepositories, } from "../blogs-query-repository";
import {BlogViewModel} from "../view-models/blogsViewModels";


export const getBlogById = async (req: Request, res: Response) => {
    let blog :BlogViewModel = await blogsQueryRepositories.getById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
        return
    }
    res.sendStatus(404)
    return
}