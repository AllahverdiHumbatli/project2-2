import {Request, Response} from "express";
import {UsersQueryViewModel} from "../../../users/api/view-models/UserViewModels";
import {usersQueryRepositories} from "../../../users/api/user-query-repository";
import {helper} from "../../../users/api/contollers/getController";
import {jwtService} from "../../../../common/application/jwt-service";
import {sessionsQueryRepo} from "../../infrastructure/sessions-query-repo";

export const getAllSessionsForUser = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isExpaired = await jwtService.verifyToken(refreshToken)
    if(!isExpaired) {
        return res.sendStatus(401);
    }
    const userId = await jwtService.getUserIdByAccessToken(refreshToken);
    const result = await sessionsQueryRepo.getAllSessionsForUser(userId!)
    res.status(200).send(result)
    return
}