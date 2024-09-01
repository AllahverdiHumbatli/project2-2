import {Request, Response} from 'express'
import {db} from "../db/mongo-db";
// import {blogCollection, postCollection, userCollection} from "../db/mongo-db";
export const deleteAlldata = async (req: Request, res: Response) => {
//    await blogCollection.deleteMany()
//     await postCollection.deleteMany()
//     await userCollection.deleteMany()


    await db.drop()
    res.sendStatus(204)
    return
}

