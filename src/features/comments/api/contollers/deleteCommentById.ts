import {Request, Response} from "express";
import {CommentsQueryRepository} from "../comments-query-repository";
import {CommentsService, StatusCode} from "../../domain/comments-service";

export const deleteCommentById = async (req: Request, res: Response) => {
    const isCommentExsist = await new CommentsQueryRepository().getCommentById(req.params.id)
    if (isCommentExsist.statusCode === StatusCode.NotFound) {
        res.sendStatus(404);
        return
    }
    const result = await new CommentsService().deleteCommentById(req.user.id, req.params.id);
    if(result.statusCode === StatusCode.Forbidden){
        return res.sendStatus(403);
    }
    return res.sendStatus(204);
}
