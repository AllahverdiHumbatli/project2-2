
import {jwtService} from "../../../../common/application/jwt-service";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {db} from "../../../../common/db/mongo-db";
import {ExpiredRefreshTokens} from "../../../../common/types/DBtypes";

export const refreshTokens  = async (req: Request, res: Response) => {

    const refreshToken = req.cookies['refreshToken'];

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
    const result = await jwtService.createNewTokensByRefreshToken(refreshToken);
    if(result){
        const {accessToken2, refreshToken2} = result

        const tokenToInsert: ExpiredRefreshTokens = {refreshToken};
        await db.getCollections().expiredRefreshTokenCollection.insertOne(tokenToInsert)

        return res.cookie("refreshToken", refreshToken2, {httpOnly: true, secure: true}).status(200).send({
            "accessToken": accessToken2
        });
    }
    return res.sendStatus(401);
    }





