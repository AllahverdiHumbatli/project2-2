import {Request, Response} from "express";
import {jwtService} from "../../../../common/application/jwt-service";
import {db} from "../../../../common/db/mongo-db";
import {authService} from "../../../userAuthorization/domain/auth-service";
import {sessionsService} from "../../domain/sessions-service";


export const deleteSessionByDeviceId = async (req: Request, res: Response) => {
    const deviceId = req.params.id
    const userId = req.user.id
    const refreshToken = req.cookies['refreshToken'];

    const isDeviceIdExists = await authService.isDeviceIdExist(deviceId)
    if(!isDeviceIdExists) {
        return res.sendStatus(404);
    }

    if(isDeviceIdExists.user_id !== req.user.id){
        return res.sendStatus(403);
    }

    await sessionsService.deleteSessionByDeviceId(deviceId)
    return res.sendStatus(204);
}