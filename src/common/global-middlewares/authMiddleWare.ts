import {Response, Request, NextFunction} from 'express'
import {jwtService} from "../application/jwt-service";
import {usersQueryRepositories} from "../../features/users/api/user-query-repository";
import {db} from "../db/mongo-db";
export const
    authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // if (!req.headers['authorization']) {
    //     return res.sendStatus(401)
    // }
    const token =  req.cookies['refreshToken'];
        // const isTokenValid = await db.getCollections().expiredRefreshTokenCollection.findOne({refreshToken: token})
        // if(!isTokenValid) {
        //     return res.sendStatus(401)
        // }
    const userId:string|null = await jwtService.getUserIdByAccessToken(token)
    if(userId){
        req.user = await usersQueryRepositories.getUserById(userId) // в req.user записывается UserViewModel для userId >
        return next()

    }
    return res.sendStatus(401)
}