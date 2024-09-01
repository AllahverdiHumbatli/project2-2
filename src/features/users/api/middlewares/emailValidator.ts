import {body} from "express-validator";

export const emailValidator = body('email')
    .isString().withMessage('not string')
    .trim()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("wrong pattern")