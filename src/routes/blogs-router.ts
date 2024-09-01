import {Router} from "express";
import {getBlogsController} from "../features/blogs/api/controllers/getController";
import {postContoller} from "../features/blogs/api/controllers/postContoller";
import {descriptionValidator} from "../features/blogs/api/middlewares/blogValidator";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {nameValidator} from "../features/blogs/api/middlewares/nameValidator";
import {websyiteUrlValidator} from "../features/blogs/api/middlewares/websyiteUrlValidator";
import {adminMiddleWare} from "../common/global-middlewares/adminMiddleWare";
import {getBlogById} from "../features/blogs/api/controllers/getByIdController";
import {updateBlogById} from "../features/blogs/api/controllers/putByIdController";
import {deleteBlogById} from "../features/blogs/api/controllers/deleteBlogByIdController";
import {titleValidator} from "../features/posts/api/middlewares/titleValidator";
import {shortDescriptionValidator} from "../features/posts/api/middlewares/shortDescriptionValidator";
import {contentValidator} from "../features/posts/api/middlewares/contentValidator";
import {blogIdValidator} from "../features/posts/api/middlewares/blogIdValidator";
import {postController} from "../features/posts/api/controllers/postController";
import {postByIdController} from "../features/posts/api/controllers/postByIdContoller";
import {getAllPostsForBlog} from "../features/posts/api/controllers/getAllPostsForBlog";


export const blogsRouter = Router()

blogsRouter.get('/',  getBlogsController)
blogsRouter.post('/', adminMiddleWare, nameValidator, descriptionValidator,websyiteUrlValidator, inputCheckErrorsMiddleware, postContoller)
blogsRouter.get("/:id", getBlogById)
blogsRouter.put("/:id", adminMiddleWare, nameValidator, descriptionValidator,websyiteUrlValidator, inputCheckErrorsMiddleware, updateBlogById)
blogsRouter.delete("/:id", adminMiddleWare,  deleteBlogById )
blogsRouter.post("/:id/posts",adminMiddleWare, titleValidator, shortDescriptionValidator, contentValidator, inputCheckErrorsMiddleware, postByIdController )
blogsRouter.get("/:id/posts", getAllPostsForBlog)