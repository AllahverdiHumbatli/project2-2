import {Request, Response} from "express";
import { CommentsQueryRepository} from "../comments-query-repository";
import {CommentsService, StatusCode} from "../../domain/comments-service";

class CommentController {
    commentsQueryRepositories: CommentsQueryRepository;
    commentsService: CommentsService;
    constructor() {
        this.commentsQueryRepositories = new CommentsQueryRepository();
        this.commentsService = new CommentsService()
    }
    async uptadeCommentById  (req: Request, res: Response)  {
        const isCommentExsist = await this.commentsQueryRepositories.getCommentById(req.params.id)
        if (isCommentExsist.statusCode === StatusCode.NotFound) {
            res.sendStatus(404);
            return
        }
        const result =  await this.commentsService.uptadeCommentById(req.user.id, req.params.id, req.body.content);
        if(result.statusCode === StatusCode.Forbidden){
            return res.sendStatus(403);
        }
        return res.sendStatus(204);
    }
    async getCommentById (req: Request, res: Response)  {
        // нужно через userid из токена и commentId из params найти лайк в колекции лайков,
        // если находим по двум этим полям то достаем оттуда наш статус
        // и присвоим его в view model а именно в поле myStatus


        const result= await this.commentsQueryRepositories.getCommentById(req.params.id, req.user?.id?req.user.id: null);
        if (result.statusCode === StatusCode.NotFound){
            res.send(404);
            return
        }
        res.status(200).send(result.data);
        return
    }
    async deleteCommentById  (req: Request, res: Response)  {
        const isCommentExsist = await this.commentsQueryRepositories.getCommentById(req.params.id)
        if (isCommentExsist.statusCode === StatusCode.NotFound) {
            res.sendStatus(404);
            return
        }
        const result = await this.commentsService.deleteCommentById(req.user.id, req.params.id);
        if(result.statusCode === StatusCode.Forbidden){
            return res.sendStatus(403);
        }
        return res.sendStatus(204);
    }
    async setLikeStatusForComment(req: Request, res: Response)  {
        const comment = await this.commentsQueryRepositories.getCommentById(req.params.id)
        if (comment.statusCode === StatusCode.NotFound) {
            res.sendStatus(404);
            return
        }
        const likeGuardDto = {
            userId: req.user.id,
            commentId: req.params.id,
            status: req.body.likeStatus,
        }
        await this.commentsService.putLikeStatusForComment(likeGuardDto)
        return res.sendStatus(204);

    }
}

export const commentController: CommentController = new CommentController()