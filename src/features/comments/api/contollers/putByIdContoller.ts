import {Request, Response} from "express";
import {CommentsService, StatusCode} from "../../domain/comments-service";
import { CommentsQueryRepository} from "../comments-query-repository";

export const uptadeCommentById = async (req: Request, res: Response) => {
    const isCommentExsist = await new CommentsQueryRepository().getCommentById(req.params.id)
    if (isCommentExsist.statusCode === StatusCode.NotFound) {
        res.sendStatus(404);
        return
    }
   const result =  await new CommentsService().uptadeCommentById(req.user.id, req.params.id, req.body.content);
    if(result.statusCode === StatusCode.Forbidden){
        return res.sendStatus(403);
    }
        return res.sendStatus(204);
}