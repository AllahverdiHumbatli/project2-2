import {Request, Response} from "express";
import {usersQueryRepositories} from "../user-query-repository";
import {CurrentUserViewModel} from "../view-models/UserViewModels";

export const getCurrentUserData =  async (req: Request, res: Response) => {
    const currentUserData:CurrentUserViewModel = await usersQueryRepositories.getCurrentUser(req.user.id)
    if(currentUserData){
        res.status(200).send(currentUserData)
        return
    }
    res.sendStatus(401)
    return
}
