import {db} from "../../../common/db/mongo-db";
import {ObjectId} from "mongodb";
import {UserDBType} from "../../../common/types/DBtypes";
import {WithId } from 'mongodb'

export const usersDbRepository = {
     async createUser(newUser: UserDBType):Promise<string>{
         const res = await db.getCollections().userCollection.insertOne(newUser)
         return res.insertedId.toString()
    },
    async deleteById (userId: string):Promise<boolean>{
         const res = await db.getCollections().userCollection.deleteOne({_id: new ObjectId(userId)})
        return res.deletedCount === 1;

    },
    async findByLoginOrEmail(loginOrEmail: string):Promise<WithId<UserDBType> | null>{
        return await db.getCollections().userCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    }
}