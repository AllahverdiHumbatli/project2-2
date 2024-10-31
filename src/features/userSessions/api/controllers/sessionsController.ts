import {Request, Response} from "express";
import {jwtService} from "../../../../common/application/jwt-service";
import {SessionsQueryRepo, sessionsQueryRepo} from "../../infrastructure/sessions-query-repo";
import {AuthorizationService, authService} from "../../../userAuthorization/domain/auth-service";
import {SessionsService, sessionsService} from "../../domain/sessions-service";
import {JwtPayload} from "jwt-decode";

class SessionsController {
    sessionsService: SessionsService;
    sessionsQueryRepo: SessionsQueryRepo;
    constructor() {
        this.sessionsService = new SessionsService();
        this.sessionsQueryRepo = new SessionsQueryRepo();
    }
    async getAllSessionsForUser(req: Request, res: Response)  {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        const isExpaired = await jwtService.verifyToken(refreshToken)
        if(!isExpaired) {
            return res.sendStatus(401);
        }
        const userId = await jwtService.getUserIdByAccessToken(refreshToken);
        const result = await this.sessionsQueryRepo.getAllSessionsForUser(userId!)
        res.status(200).send(result)
        return
    }
    async deleteSessionByDeviceId  (req: Request, res: Response)  {
        const deviceId = req.params.id
        const userId = req.user.id
        const refreshToken = req.cookies['refreshToken'];

        const isDeviceIdExists = await (new AuthorizationService()).isDeviceIdExist(deviceId)
        if(!isDeviceIdExists) {
            return res.sendStatus(404);
        }

        if(isDeviceIdExists.user_id !== req.user.id){
            return res.sendStatus(403);
        }

        await this.sessionsService.deleteSessionByDeviceId(deviceId)
        return res.sendStatus(204);
    }
    async deleteAllSessionsExcludeCurrent (req: Request, res: Response)  {
        const refreshToken = req.cookies['refreshToken'];
        const tokenPayload:JwtPayload|null = await jwtService.getTokenPayload(refreshToken)
        const currentDeviceId = tokenPayload!.deviceId
        await this.sessionsService.deleteAllSessionsExcludeCurrent(currentDeviceId)
        return res.sendStatus(204);

    }
}
export const sessionController = new SessionsController()