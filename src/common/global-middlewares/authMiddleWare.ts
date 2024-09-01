import {Response, Request, NextFunction} from 'express'
import {jwtService} from "../application/jwt-service";
import {usersQueryRepositories} from "../../features/users/api/user-query-repository";
export const
    authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['authorization']) {
        return res.sendStatus(401)
    }
    const token = req.headers['authorization'].split(" ")[1]
    const userId:string|null = await jwtService.getUserIdByToken(token)
    if(userId){
        req.user = await usersQueryRepositories.getUserById(userId) // в req.user записывается UserViewModel для userId >
        return next()
    }
    return res.sendStatus(401)
}