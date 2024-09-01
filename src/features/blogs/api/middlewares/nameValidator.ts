import {body} from "express-validator";

export const nameValidator = body("name")
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('more then 15 or 0')