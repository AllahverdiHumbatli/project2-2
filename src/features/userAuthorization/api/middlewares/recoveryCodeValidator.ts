import {body} from "express-validator";

export const recoveryCodeValidator = body('recoveryCode')
    .isString().withMessage('not string')