import { body } from 'express-validator';

export const likeStatusValidator = body('likeStatus')
    .isString().withMessage('likeStatus must be a string')
    .isIn(['None', 'Like', 'Dislike']).withMessage('Invalid likeStatus value. Must be "None", "Like", or "Dislike"');
