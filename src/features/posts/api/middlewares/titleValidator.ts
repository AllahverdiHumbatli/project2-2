import {body} from "express-validator";

export const titleValidator = body("title")
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('more then 30 or 0')