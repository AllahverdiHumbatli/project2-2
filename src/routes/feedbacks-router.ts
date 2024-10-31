import {Router} from "express";
import {getCommentById} from "../features/comments/api/contollers/getCommentById";
import {authMiddleware} from "../common/global-middlewares/authMiddleWare";
import {contentValidatorForComment} from "../features/comments/api/middlewares/contentValidator";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {uptadeCommentById} from "../features/comments/api/contollers/putByIdContoller";
import {deleteCommentById} from "../features/comments/api/contollers/deleteCommentById";
import {commentController} from "../features/comments/api/contollers/commentsController";
import {authMiddleWareForAccesToken} from "../common/global-middlewares/authMiddleWareForAccesToken";
import {likeStatusValidator} from "../features/comments/api/middlewares/likeStatusValidator";
import {authMiddleWareForLikesMonitoring} from "../common/global-middlewares/authMiddleWareForLikesMonitoring";

export const feedbacksRouter = Router()

feedbacksRouter.get("/:id",authMiddleWareForLikesMonitoring, commentController.getCommentById.bind(commentController))
feedbacksRouter.put("/:id", authMiddleWareForAccesToken/* authMiddleware,*/ , contentValidatorForComment, inputCheckErrorsMiddleware, commentController.uptadeCommentById.bind(commentController))
feedbacksRouter.delete("/:id", authMiddleWareForAccesToken,/* authMiddleware,*/ commentController.deleteCommentById.bind(commentController) )
feedbacksRouter.put("/:id/like-status", authMiddleWareForAccesToken/* authMiddleware,*/ , likeStatusValidator, inputCheckErrorsMiddleware, commentController.setLikeStatusForComment.bind(commentController))


