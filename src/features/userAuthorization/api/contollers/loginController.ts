import {Request, Response} from "express";
import {blogsService} from "../../../blogs/domain/blogs-service";
import {usersService} from "../../../users/domain/users-service";
import {jwtService} from "../../../../common/application/jwt-service";
import {UserDBType} from "../../../../common/types/DBtypes";
import {WithId } from 'mongodb'
import jwt from "jsonwebtoken";
import {authService} from "../../domain/auth-service";

export const checkLoginAndGiveToken = async (req: Request, res: Response) => {

    if(typeof req.body.loginOrEmail !==  "string"){
        return res.status(400).send({
            "errorsMessages": [
                {
                    "message": "not string",
                    "field": "loginOrEmail"
                }
            ]
        });
    }
    if(typeof req.body.password !==  "string"){
        return res.status(400).send({
            "errorsMessages": [
                {
                    "message": "not string",
                    "field": "password"
                }
            ]
        });
    }

    const user:WithId<UserDBType> | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if(user) {
        const ip  = req.ip || "127.0.0.1";
        const userAgent = req.headers['user-agent']|| 'Unknown User-Agent';
        const {accessToken, refreshToken} = await authService.createSession(user, ip, userAgent )
        return res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true}).status(200).send({
            accessToken
        });
    }

    return res.sendStatus(401)
}