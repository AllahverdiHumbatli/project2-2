import {Request, Response} from "express";
import {UsersQueryViewModel} from "../view-models/UserViewModels";
import {usersQueryRepositories} from "../user-query-repository";
import {helper} from "./getController";
import {jwtService} from "../../../../common/application/jwt-service";

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
    const result = await usersQueryRepositories.getAllSessionsForUser(userId!)
    res.status(200).send(result)
    return
}