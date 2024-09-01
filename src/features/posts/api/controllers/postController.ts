import {NextFunction, Request, Response} from 'express'

import {postsService} from "../../domain/posts-service";
import {postQueryRepository} from "../post-query-repository";

export const postController = async (req: Request, res: Response, next: NextFunction) => {

    const newPostId = await postsService.postPOST(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    const newPost = await postQueryRepository.getPostById(newPostId)
    res.status(201).send(newPost);
    return

}
