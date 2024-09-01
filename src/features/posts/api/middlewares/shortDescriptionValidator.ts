import {body} from "express-validator";

export const shortDescriptionValidator = body("shortDescription")
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('more then 100 or 0')