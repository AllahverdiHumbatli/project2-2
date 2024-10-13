import {Response, Request, NextFunction} from 'express'

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    if (typeof email !== 'string') {
        return res.status(400).json({ errorsMessages: [{ message: "email", field: "email" }] });
    }

    const trimmedEmail = email.trim();
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailPattern.test(trimmedEmail)) {
        return res.status(400).json({ errorsMessages: [{ message: "email", field: "email" }] });
    }

    return next(); // Явный возврат next()
};
