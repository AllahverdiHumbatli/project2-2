import {body} from "express-validator";

export const websyiteUrlValidator = body("websiteUrl")
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('more then 100 or 0')
    .isURL().withMessage('not url')
