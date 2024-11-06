import {Request, Response} from 'express'
import {BlogsDbRepository} from "../../features/blogs/infrastructure/blogs-db-repository";
import {PostDbRepository} from "../../features/posts/infrastructure/post-db-repository";
import {CommentsDbRepository} from "../../features/comments/infrastructure/comments-db-repository";
import {SessionDBRepo} from "../../features/userSessions/infrastructure/sessions-db-repository";
import {UsersDbRepository} from "../../features/users/infrastructure/users-db-repository";
// import {blogCollection, postCollection, userCollection} from "../db/mongo-db";
export const deleteAlldata = async (req: Request, res: Response) => {
//    await blogCollection.deleteMany()
//     await postCollection.deleteMany()
//     await userCollection.deleteMany()
    try {

        await Promise.all([
            new BlogsDbRepository().deleteAllData(),
            new PostDbRepository().deleteAllData(),
            new CommentsDbRepository().deleteAllData(),
            new SessionDBRepo().deleteAllData(),
            new UsersDbRepository().deleteAllData(),
        ])

    } catch (e: unknown) {
        console.error('Error in drop db:', e);

    }
    res.sendStatus(204)
    return
}

