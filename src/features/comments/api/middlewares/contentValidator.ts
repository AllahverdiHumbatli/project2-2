import {body} from "express-validator";

export const contentValidatorForComment = body("content")
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('more then 500 or 0')