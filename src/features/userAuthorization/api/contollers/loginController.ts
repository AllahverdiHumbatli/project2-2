import {Request, Response} from "express";
import {blogsService} from "../../../blogs/domain/blogs-service";
import {usersService} from "../../../users/domain/users-service";
import {jwtService} from "../../../../common/application/jwt-service";
import {UserDBType} from "../../../../common/types/DBtypes";
import {WithId } from 'mongodb'
import jwt from "jsonwebtoken";

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
    console.log("loginOrEmail", req.body.loginOrEmail);
    const user:WithId<UserDBType> | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if(user) {

        const {accessToken2, refreshToken2} = await jwtService.createJWT(user)

        return res.cookie("refreshToken", refreshToken2, {httpOnly: true, secure: true}).status(200).send({
            "accessToken": accessToken2
        });
    }

    return res.sendStatus(401)
}