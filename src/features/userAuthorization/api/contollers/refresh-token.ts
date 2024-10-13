
import {jwtService} from "../../../../common/application/jwt-service";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {db} from "../../../../common/db/mongo-db";
import {ExpiredRefreshTokens} from "../../../../common/types/DBtypes";
import {UsersSessionsModel} from "../../../../common/db/mongoose/mongooseSchemas";

export const refreshTokens  = async (req: Request, res: Response) => {

    const usedRefreshToken = req.cookies['refreshToken'];

    if (!usedRefreshToken) {
        return res.sendStatus(401);
    }
    const isExpaired = await jwtService.verifyToken(usedRefreshToken)
    if(!isExpaired) {
        return res.sendStatus(401);
    }
    const usedTokenPayload = await jwtService.getTokenPayload(usedRefreshToken)
    const userSession =
        await UsersSessionsModel
            .findOne({"user_id": usedTokenPayload?.userId, "iat": usedTokenPayload?.iat})
    if(!userSession) {
        return res.sendStatus(401);
    }

    const result = await jwtService.createNewTokensByRefreshToken(usedRefreshToken);
    if(result){
        const {accessToken, refreshToken} = result

        const newTokenPayload = await jwtService.getTokenPayload(refreshToken)

        await UsersSessionsModel.updateOne({
            "device_id": newTokenPayload!.deviceId}, {$set: {"iat" : newTokenPayload!.iat}
        });
        return res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true}).status(200).send({
            "accessToken": accessToken
        });
    }
    return res.sendStatus(401);
    }





