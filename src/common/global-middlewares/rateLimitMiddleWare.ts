import {NextFunction, Request, Response} from 'express'
import {RateLimitModel} from "../db/mongoose/mongooseSchemas";


export const requestLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await RateLimitModel.insertMany([{
        ip: req.ip as string,
        url: req.originalUrl,
        date: Date.now(),
    }]);

    let count = await RateLimitModel.countDocuments({
        ip: req.ip,
         url: req.originalUrl,
        date: { $gte: Date.now() - 10 * 1000 },
    });



    if (count > 5) {
        res.sendStatus(429);
        return;
    }

    next();
};
