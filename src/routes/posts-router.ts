import {Router} from "express";
import {getController} from "../features/posts/api/controllers/getController";
import {postController} from "../features/posts/api/controllers/postController";
import {titleValidator} from "../features/posts/api/middlewares/titleValidator";
import {shortDescriptionValidator} from "../features/posts/api/middlewares/shortDescriptionValidator";
import {contentValidator} from "../features/posts/api/middlewares/contentValidator";
import {blogIdValidator} from "../features/posts/api/middlewares/blogIdValidator";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {adminMiddleWare} from "../common/global-middlewares/adminMiddleWare";
import {getByIdController} from "../features/posts/api/controllers/getByIdController";
import {putByIdContoller} from "../features/posts/api/controllers/putByIdContoller";
import {deletePostById} from "../features/posts/api/controllers/deleteByIdContoller";
import {authMiddleware} from "../common/global-middlewares/authMiddleWare";
import { postCommentContoller} from "../features/posts/api/controllers/postComment";
import {contentValidatorForComment} from "../features/comments/api/middlewares/contentValidator";
import {getPostComments} from "../features/posts/api/controllers/getPostComments";

export const postsRouter = Router()

postsRouter.get("/",  getController)
postsRouter.post("/",  adminMiddleWare, titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputCheckErrorsMiddleware, postController)
postsRouter.get("/:id",getByIdController )
postsRouter.put("/:id", adminMiddleWare, titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputCheckErrorsMiddleware, putByIdContoller)
postsRouter.delete("/:id",adminMiddleWare,  deletePostById)
postsRouter.post('/:id/comments', authMiddleware, contentValidatorForComment, inputCheckErrorsMiddleware, postCommentContoller )
postsRouter.get("/:id/comments", getPostComments)