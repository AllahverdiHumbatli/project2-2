import {Request, Response} from "express";
import {jwtService} from "../../../../common/application/jwt-service";
import {db} from "../../../../common/db/mongo-db";
import {authService} from "../../../userAuthorization/domain/auth-service";


export const deleteSessionByDeviceId = async (req: Request, res: Response) => {
    const deviceId = req.params.id
    const userId = req.user.id
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isExpaired = await jwtService.verifyToken(refreshToken)
    if(!isExpaired) {
        return res.sendStatus(401);
    }
    const tokenPayload = await jwtService.getTokenPayload(refreshToken)
    const isTokenValidByIat = await authService.isTokenInvalidByIat(tokenPayload!)
    if(isTokenValidByIat) {
        return res.sendStatus(401);
    }
    console.log('USERiD delete:', userId)

    console.log('deviceId delete:', deviceId)
    const isDeviceIdExists = await authService.isDeviceIdExist(deviceId)
    if(!isDeviceIdExists) {
        return res.sendStatus(404);
    }

    if(isDeviceIdExists.user_id !== req.user.id){
        return res.sendStatus(403);
    }

    await db.getCollections().usersSessionsCollection.deleteOne({device_id: deviceId})
    return res.sendStatus(204);
}