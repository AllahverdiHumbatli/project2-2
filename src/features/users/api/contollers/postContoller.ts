import {usersService} from "../../domain/users-service";
import {Request, Response} from 'express'
import {postsService} from "../../../posts/domain/posts-service";
import {usersQueryRepositories} from "../user-query-repository";
import {UserViewModel, ValidationErrorForLoginEmail} from "../view-models/UserViewModels";

export const postUser = async (req: Request, res: Response) => {
    const isConfirmed = true
    console.log(req.body.email)
    const newUserId:string|ValidationErrorForLoginEmail = await usersService.createUser({
        login:req.body.login,
        password:req.body.password,
        email:req.body.email,
        isConfirmed:isConfirmed,


    })
    if(Array.isArray(newUserId)){
        res.status(400).send({ errorsMessages: [ newUserId[0] ] })
        return
    }
    const result:false|UserViewModel = await usersQueryRepositories.getUserById(newUserId)
    if(result) {
        res.status(201).send(result)
    }
}