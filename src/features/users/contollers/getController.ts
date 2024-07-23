import {usersService} from "../../../domain/users-service";
import {Request, Response} from 'express'
import {usersQueryRepositories} from "../user-query-repository";

export const helper = (query: {[key: string]: string| undefined}) => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection : 'desc',
        searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,

    }
}

export const getUsers = async (req: Request, res: Response) => {
    const sanitizedQuery = helper(req.query as {[key: string]: string| undefined})
    console.log("helper", sanitizedQuery)
    const allUsers = await usersQueryRepositories.getUsers(sanitizedQuery)
    res.status(200).send(allUsers)
    return
}