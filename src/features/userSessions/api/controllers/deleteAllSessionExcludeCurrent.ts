import {Request, Response} from "express";
import {jwtService} from "../../../../common/application/jwt-service";
import {sessionsService} from "../../domain/sessions-service";
import {JwtPayload} from "jwt-decode";


export const deleteAllSessionsExcludeCurrent = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];
    const tokenPayload:JwtPayload|null = await jwtService.getTokenPayload(refreshToken)
    const currentDeviceId = tokenPayload!.deviceId
    await sessionsService.deleteAllSessionsExcludeCurrent(currentDeviceId)
    return res.sendStatus(204);

}