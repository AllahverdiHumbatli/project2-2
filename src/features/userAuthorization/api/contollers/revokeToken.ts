import {Request, Response} from "express";
import {db} from "../../../../common/db/mongo-db";
import {ExpiredRefreshTokens} from "../../../../common/types/DBtypes";
import jwt from "jsonwebtoken";
import {jwtService} from "../../../../common/application/jwt-service";

export const revokeToken  = async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isExpaired = await jwtService.verifyToken(refreshToken)
    if(!isExpaired) {
        return res.sendStatus(401);
    }
    const isTokenValid = await db.getCollections().expiredRefreshTokenCollection.findOne({refreshToken: refreshToken})
    if(isTokenValid) {
        return res.sendStatus(401)
    }
    const tokenToInsert: ExpiredRefreshTokens = { refreshToken };
    await db.getCollections().expiredRefreshTokenCollection.insertOne(tokenToInsert)
    return res.sendStatus(204);
}