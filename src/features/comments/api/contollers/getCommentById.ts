import {Request, Response} from "express";
import { StatusCode} from "../../domain/comments-service";
import { CommentsQueryRepository} from "../comments-query-repository";
import {CommentViewType} from "../view-models/commentViewType";
import {Result} from "express-validator";

export const getCommentById =  async (req: Request, res: Response) => {
    const result= await new CommentsQueryRepository().getCommentById(req.params.id);
    if (result.statusCode === StatusCode.NotFound){
        res.send(404);
        return
    }
        res.status(200).send(result.data);
        return
}
// await commentsService.getCommentById(req.params.id)