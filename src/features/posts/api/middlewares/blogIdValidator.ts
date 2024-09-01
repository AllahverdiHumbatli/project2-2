import {body} from "express-validator";
import {blogsRepositories} from "../../../blogs/infrastructure/blogs-db-repository";
import {blogsQueryRepositories, } from "../../../blogs/api/blogs-query-repository";

export const blogIdValidator = body("blogId")
    .isString().withMessage('not string').trim().custom(async blogId=> {
        console.log("проверка id блога "+ blogId)
    const blog = await blogsQueryRepositories.getById(blogId)
    console.log("то что возвращает блог" + blog)
        if(!blog){ throw new Error()
        }
    return blog
}).withMessage('no blog')
