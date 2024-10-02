import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {authService} from "../../features/userAuthorization/domain/auth-service";
import {usersQueryRepositories} from "../../features/users/api/user-query-repository";

export const
    authForRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        const isExpired = await jwtService.verifyToken(refreshToken)
        if(!isExpired) {
            return res.sendStatus(401);
        }
        const tokenPayload = await jwtService.getTokenPayload(refreshToken)
        const isTokenValidByIat = await authService.isTokenInvalidByIat(tokenPayload!)
        if(isTokenValidByIat) {
            return res.sendStatus(401);
        }
        const userId:string|null = jwtService.getUserIdByAccessToken(refreshToken)
        if(userId){
            req.user = await usersQueryRepositories.getUserById(userId) // в req.user записывается UserViewModel для userId >
            return next()

        }
        return res.sendStatus(401)
    }