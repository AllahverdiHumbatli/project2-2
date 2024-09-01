import {body} from "express-validator";

export const loginValidator = body('login')
.isString().withMessage('not string')
.trim().isLength({min: 3, max: 10}).withMessage('more then 10 or less then 3')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("wrong pattern")