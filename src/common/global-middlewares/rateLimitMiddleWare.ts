import {Response, Request, NextFunction} from 'express'
import {db} from "../db/mongo-db";


export const requestLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await db.getCollections().rateLimitsCollection.insertOne({
        ip: req.ip as string,
        url: req.originalUrl,
        date: Date.now(),
    });

    let count = await db.getCollections().rateLimitsCollection.countDocuments({
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
