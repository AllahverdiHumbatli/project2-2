import {Request, Response} from "express";
import {blogsService} from "../../../domain/blogs-service";
import {usersService} from "../../../domain/users-service";

export const deleteUserById = async (req: Request, res: Response) => {
    const isDeleted = await usersService.deleteById(req.params.id)
    {
        if (isDeleted) {
            return res.sendStatus(204)
        }
        return res.sendStatus(404)
    }
}