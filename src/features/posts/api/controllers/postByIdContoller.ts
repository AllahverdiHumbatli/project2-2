import {NextFunction, Request, Response} from 'express'

import {postsService} from "../../domain/posts-service";
import {postQueryRepository} from "../post-query-repository";

export const postByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const isValidObjectId = ((id:string) => { return /^[0-9a-fA-F]{24}$/.test(id) } )
    console.log("true or false",isValidObjectId)
    if(isValidObjectId(req.params.id)){
        const newPostId = await postsService.postPOSTByBlogId(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
        if(newPostId){
            const newPost = await postQueryRepository.getPostById(newPostId)
            res.status(201).send(newPost);
            return
        }
        res.sendStatus(404)
        return
    }
    res.sendStatus(404)
    return
}
