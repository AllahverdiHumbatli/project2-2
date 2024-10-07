import {body} from "express-validator";

export const newPasswordValidator = body('newPassword')
    .isString().withMessage('not string')
    .trim().isLength({min: 6, max: 20}).withMessage('more then 10 or less then 3')
    .withMessage("wrong pattern")