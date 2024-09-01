import {Request, Response} from "express";
import {blogsService} from "../../../blogs/domain/blogs-service";
import {usersService} from "../../../users/domain/users-service";
import {jwtService} from "../../../../common/application/jwt-service";
import {UserDBType} from "../../../../common/types/DBtypes";
import {WithId } from 'mongodb'

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
    if(user){
        const token: string = await jwtService.createJWT(user)
        return res.status(200).send({
            "accessToken": token
        })
    }

    return res.sendStatus(401)
}