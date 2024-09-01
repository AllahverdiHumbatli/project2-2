import {Request, Response} from "express";
import {commentsQueryRepositories} from "../comments-query-repository";
import {commentsService, StatusCode} from "../../domain/comments-service";

export const deleteCommentById = async (req: Request, res: Response) => {
    const isCommentExsist = await commentsQueryRepositories.getCommentById(req.params.id)
    if (isCommentExsist.statusCode === StatusCode.NotFound) {
        res.sendStatus(404);
        return
    }
    const result = await commentsService.deleteCommentById(req.user.id, req.params.id);
    if(result.statusCode === StatusCode.Forbidden){
        return res.sendStatus(403);
    }
    return res.sendStatus(204);
}
