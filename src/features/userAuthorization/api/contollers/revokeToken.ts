import {Request, Response} from "express";
import {db} from "../../../../common/db/mongo-db";
import {ExpiredRefreshTokens} from "../../../../common/types/DBtypes";
import jwt from "jsonwebtoken";
import {jwtService} from "../../../../common/application/jwt-service";
import {authService} from "../../domain/auth-service";
import {UsersSessionsModel} from "../../../../common/db/mongoose/mongooseSchemas";

export const revokeToken  = async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies['refreshToken'];
    if (!refreshToken) {
        console.log('!refresh token at revoke')
        return res.sendStatus(401);
    }
    const isExpaired = await jwtService.verifyToken(refreshToken)
    if(!isExpaired) {
        console.log('!isExpired at revoke')
        return res.sendStatus(401);
    }

    const tokenPayload = await jwtService.getTokenPayload(refreshToken)
    const isTokenValidByIat = await authService.isTokenInvalidByIat(tokenPayload!)
    if(isTokenValidByIat) {
        console.log('isTokenValidByIat at revoke')
        return res.sendStatus(401);
    }

    // const tokenToInsert: ExpiredRefreshTokens = { refreshToken };
    // await db.getCollections().expiredRefreshTokenCollection.insertOne(tokenToInsert)
    await UsersSessionsModel.deleteOne({
        device_id: tokenPayload!.deviceId, iat: tokenPayload!.iat})

    console.log("padayet v samom konce at revoke ")
    return res.sendStatus(204);
}