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
    },
    async findByEmailConfirmationCode(code: string):Promise<WithId<UserDBType> | null>{
        return await db.getCollections().userCollection.findOne({"emailConfirmation.confirmationCode": code});
    },
    async updateEmailConfirmationFlag(code:string):Promise<boolean> {
        const res = await db.getCollections().userCollection.updateOne({"emailConfirmation.confirmationCode": code}, {$set: {'emailConfirmation.isConfirmed': true}});
        if(res.matchedCount === 1){
        return true
    }
    return false
    },
    async findUserById(userId: string):Promise<WithId<UserDBType> | null>{
       return  await db.getCollections().userCollection.findOne({_id: new ObjectId(userId)})
    },
    async updateConfirmationCodeByEmail(email: string, newConfirmationCode: string){
        await db.getCollections().userCollection.updateOne({email}, {$set: {'emailConfirmation.confirmationCode': newConfirmationCode}});
    }

}