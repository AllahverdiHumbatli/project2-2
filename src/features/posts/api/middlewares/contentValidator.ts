import {body} from "express-validator";

export const contentValidator = body("content")
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('more then 10000 or 0')