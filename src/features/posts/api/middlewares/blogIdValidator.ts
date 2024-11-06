import {body} from "express-validator";

import {blogsQueryRepository} from "../../../../composition-root/blogsCompositionRoot";

export const blogIdValidator = body("blogId")
    .isString().withMessage('not string').trim().custom(async blogId=> {

    const blog = await blogsQueryRepository.getById(blogId)

        if(!blog){
            console.log("зашли сюда")
            throw new Error()
        }
    return blog
}).withMessage('no blog')
