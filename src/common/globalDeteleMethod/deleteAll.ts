import {Request, Response} from 'express'
import {db} from "../db/mongo-db";
import mongoose from "mongoose";
import {log} from "node:util";
// import {blogCollection, postCollection, userCollection} from "../db/mongo-db";
export const deleteAlldata = async (req: Request, res: Response) => {
//    await blogCollection.deleteMany()
//     await postCollection.deleteMany()
//     await userCollection.deleteMany()
    const db = mongoose.connection.db

    console.log(3)
    console.log(db, " db")
    try {
        //await this.getDbName().dropDatabase()
        const collections = await db!.listCollections().toArray();
        console.log(collections, " collections")
        for (const collection of collections) {

            await db!.collection(collection.name).deleteMany({})// .then(r => console.log(r));
        }
        console.log(228)
    } catch (e: unknown) {
        console.error('Error in drop db:', e);

    }

    console.log(4)
    res.sendStatus(204)
    return
}

