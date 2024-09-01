import {usersService} from "../../domain/users-service";
import {Request, Response} from 'express'
import {postsService} from "../../../posts/domain/posts-service";
import {usersQueryRepositories} from "../user-query-repository";
import {UserViewModel, ValidationErrorForLoginEmail} from "../view-models/UserViewModels";

export const postUser = async (req: Request, res: Response) => {
    const isConfirmed = true
    const newUserId:string|ValidationErrorForLoginEmail = await usersService.createUser(req.body.login, req.body.email, req.body.password, isConfirmed)
    if(Array.isArray(newUserId)){
        res.status(400).send({ errorsMessages: [ newUserId[0] ] })
        return
    }
    const result:false|UserViewModel = await usersQueryRepositories.getUserById(newUserId)
    if(result) {
        res.status(201).send(result)
    }
}