import {body} from "express-validator";

export const passwordValidator = body('password')
    .isString().withMessage('not string')
    .trim().isLength({min: 6, max: 20}).withMessage('more then 20 or less than 6')