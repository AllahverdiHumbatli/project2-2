import {Request, Response} from "express";
import {UsersQueryViewModel, UserViewModel, ValidationErrorForLoginEmail} from "../view-models/UserViewModels";
import {UserService, usersService} from "../../domain/users-service";
import {UserQueryRepository, usersQueryRepositories} from "../user-query-repository";

class UserController {
    usersService: UserService
    usersQueryRepositories: UserQueryRepository

    constructor() {
        this.usersService = new UserService();
        this.usersQueryRepositories = new UserQueryRepository();
    }

    async createUser(req: Request, res: Response) {
        const isConfirmed = true
        console.log(req.body.email)
        const newUserId:string|ValidationErrorForLoginEmail = await this.usersService.createUser({
            login:req.body.login,
            password:req.body.password,
            email:req.body.email,
            isConfirmed:isConfirmed,


        })
        if(Array.isArray(newUserId)){
            res.status(400).send({ errorsMessages: [ newUserId[0] ] })
            return
        }
        const result:false|UserViewModel = await this.usersQueryRepositories.getUserById(newUserId)
        if(result) {
            res.status(201).send(result)
        }
    }

    helper(query: {[key: string]: string| undefined}):UsersQueryViewModel {
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,

        }
    }

    async getUsers  (req: Request, res: Response)  {
        const sanitizedQuery:UsersQueryViewModel = this.helper(req.query as {[key: string]: string| undefined})
        const allUsers = await this.usersQueryRepositories.getUsers(sanitizedQuery)
        res.status(200).send(allUsers)
        return
    }
    async deleteUserById(req: Request, res: Response) {
        const isDeleted:boolean = await this.usersService.deleteById(req.params.id)
        {
            if (isDeleted) {
                return res.sendStatus(204)
            }
            return res.sendStatus(404)
        }
    }
}
export const usersController = new UserController()