import {Router} from "express";
import {descriptionValidator} from "../features/blogs/api/middlewares/blogValidator";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {nameValidator} from "../features/blogs/api/middlewares/nameValidator";
import {websyiteUrlValidator} from "../features/blogs/api/middlewares/websyiteUrlValidator";
import {adminMiddleWare} from "../common/global-middlewares/adminMiddleWare";
import {titleValidator} from "../features/posts/api/middlewares/titleValidator";
import {shortDescriptionValidator} from "../features/posts/api/middlewares/shortDescriptionValidator";
import {contentValidator} from "../features/posts/api/middlewares/contentValidator";
import {blogIdValidator} from "../features/posts/api/middlewares/blogIdValidator";
import {blogsController} from "../composition-root/blogsCompositionRoot";
import {postsController} from "../features/posts/api/controllers/postsController";


export const blogsRouter = Router()

blogsRouter.get('/',  blogsController.getAllBlogs.bind(blogsController))
blogsRouter.post('/', adminMiddleWare, nameValidator, descriptionValidator,websyiteUrlValidator, inputCheckErrorsMiddleware, blogsController.postController.bind(blogsController))
blogsRouter.get("/:id", blogsController.getBlogById.bind(blogsController))
blogsRouter.put("/:id", adminMiddleWare, nameValidator, descriptionValidator,websyiteUrlValidator, inputCheckErrorsMiddleware, blogsController.updateBlogById.bind(blogsController))
blogsRouter.delete("/:id", adminMiddleWare,  blogsController.deleteBlogById.bind(blogsController))
blogsRouter.post("/:id/posts",adminMiddleWare, titleValidator, shortDescriptionValidator, contentValidator, inputCheckErrorsMiddleware, postsController.createPostByBlogId.bind(postsController) )
blogsRouter.get("/:id/posts", postsController.getAllPostsForBlog.bind(postsController))