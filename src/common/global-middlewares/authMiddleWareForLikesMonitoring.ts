import {Response, Request, NextFunction} from 'express'
import {usersQueryRepositories} from "../../features/users/api/user-query-repository";
import {jwtService} from "../application/jwt-service";

export const authMiddleWareForLikesMonitoring = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(" ")[1]
    if(token){
        const userId = await jwtService.getUserIdByAccessToken(token)
        if(userId){
            req.user = await usersQueryRepositories.getUserById(userId)
            return next()
        }
    }
    return next()
}