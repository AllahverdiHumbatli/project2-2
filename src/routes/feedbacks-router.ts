import {Router} from "express";
import {getCommentById} from "../features/comments/api/contollers/getCommentById";
import {authMiddleware} from "../common/global-middlewares/authMiddleWare";
import {contentValidatorForComment} from "../features/comments/api/middlewares/contentValidator";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {uptadeCommentById} from "../features/comments/api/contollers/putByIdContoller";
import {deleteCommentById} from "../features/comments/api/contollers/deleteCommentById";

export const feedbacksRouter = Router()

feedbacksRouter.get("/:id", getCommentById)
feedbacksRouter.put("/:id", authMiddleware, contentValidatorForComment, inputCheckErrorsMiddleware, uptadeCommentById)
feedbacksRouter.delete("/:id", authMiddleware, deleteCommentById )