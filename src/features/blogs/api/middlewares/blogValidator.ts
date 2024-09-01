import {body} from "express-validator";

export const descriptionValidator = body("description")
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage('more then 500 or 0')