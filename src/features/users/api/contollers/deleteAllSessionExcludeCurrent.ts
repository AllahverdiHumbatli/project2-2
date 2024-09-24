import {Request, Response} from "express";
import {jwtService} from "../../../../common/application/jwt-service";
import {db} from "../../../../common/db/mongo-db";


export const deleteAllSessionsExcludeCurrent = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isExpaired = await jwtService.verifyToken(refreshToken)
    if(!isExpaired) {
        return res.sendStatus(401);
    }
    const tokenPayload = await jwtService.getTokenPayload(refreshToken)
    const currentDeviceId = tokenPayload!.deviceId
    await db.getCollections().usersSessionsCollection.deleteMany({
        device_id: { $ne: currentDeviceId }
    })
    return res.sendStatus(204);

}