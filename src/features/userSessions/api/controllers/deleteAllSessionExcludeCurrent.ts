import {Request, Response} from "express";
import {jwtService} from "../../../../common/application/jwt-service";
import {db} from "../../../../common/db/mongo-db";
import {sessionsService} from "../../domain/sessions-service";


export const deleteAllSessionsExcludeCurrent = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];
    const tokenPayload = await jwtService.getTokenPayload(refreshToken)
    const currentDeviceId = tokenPayload!.deviceId
    await sessionsService.deleteAllSessionsExcludeCurrent(currentDeviceId)
    return res.sendStatus(204);

}