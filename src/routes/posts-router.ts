import {Router} from "express";
import {titleValidator} from "../features/posts/api/middlewares/titleValidator";
import {shortDescriptionValidator} from "../features/posts/api/middlewares/shortDescriptionValidator";
import {contentValidator} from "../features/posts/api/middlewares/contentValidator";
import {blogIdValidator} from "../features/posts/api/middlewares/blogIdValidator";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {adminMiddleWare} from "../common/global-middlewares/adminMiddleWare";
import {contentValidatorForComment} from "../features/comments/api/middlewares/contentValidator";
import {postsController} from "../features/posts/api/controllers/postsController";
import {authMiddleWareForAccesToken} from "../common/global-middlewares/authMiddleWareForAccesToken";
import {authMiddleWareForLikesMonitoring} from "../common/global-middlewares/authMiddleWareForLikesMonitoring";

export const postsRouter = Router()

postsRouter.get("/",  postsController.getPosts.bind(postsController))
postsRouter.post("/",  adminMiddleWare, titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputCheckErrorsMiddleware, postsController.createPost.bind(postsController))
postsRouter.get("/:id", postsController.getPostById.bind(postsController) )
postsRouter.put("/:id", adminMiddleWare, titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputCheckErrorsMiddleware, postsController.updatePostById.bind(postsController) )
postsRouter.delete("/:id",adminMiddleWare,  postsController.deletePostById.bind(postsController))
postsRouter.post('/:id/comments', authMiddleWareForAccesToken /* тут стоял authmiddlaware*/, contentValidatorForComment, inputCheckErrorsMiddleware, postsController.createComment.bind(postsController) )
postsRouter.get("/:id/comments", authMiddleWareForLikesMonitoring, postsController.getPostComments.bind(postsController))