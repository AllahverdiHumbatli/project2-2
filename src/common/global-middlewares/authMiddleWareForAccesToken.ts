import {Response, Request, NextFunction} from 'express'
import {usersQueryRepositories} from "../../features/users/api/user-query-repository";
import {jwtService} from "../application/jwt-service";

export const authMiddleWareForAccesToken = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['authorization']) {
        return res.sendStatus(401)
    }
    const token = req.headers['authorization'].split(" ")[1]
    const userId = await jwtService.getUserIdByAccessToken(token)
    if(userId){
        req.user = await usersQueryRepositories.getUserById(userId)
        return next()
    }
    return res.sendStatus(401)
}