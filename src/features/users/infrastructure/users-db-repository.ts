import {db} from "../../../common/db/mongo-db";
import {ObjectId} from "mongodb";
import {UserDBType} from "../../../common/types/DBtypes";
import {WithId } from 'mongodb'
import {UsersModel} from "../../../common/db/mongoose/mongooseSchemas";

export const usersDbRepository = {
     async createUser(newUser: UserDBType):Promise<string>{
         const res = await UsersModel.insertMany([newUser])
         return res[0]._id.toString()
    },
    async deleteById (userId: string):Promise<boolean>{
         const res = await UsersModel.deleteOne({_id: new ObjectId(userId)})
        return res.deletedCount === 1;

    },
    async findByLoginOrEmail(loginOrEmail: string):Promise<WithId<UserDBType> | null>{
        return await UsersModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    },
    async findByEmailConfirmationCode(code: string):Promise<WithId<UserDBType> | null>{
        return await UsersModel.findOne({"emailConfirmation.confirmationCode": code});
    },
    async updateEmailConfirmationFlag(code:string):Promise<boolean> {
        const res = await UsersModel.updateOne({"emailConfirmation.confirmationCode": code}, {$set: {'emailConfirmation.isConfirmed': true}});
        if(res.matchedCount === 1){
        return true
    }
    return false
    },
    async findUserById(userId: string):Promise<WithId<UserDBType> | null>{
       return  UsersModel.findOne({_id: new ObjectId(userId)})
    },
    async updateConfirmationCodeByEmail(email: string, newConfirmationCode: string){
        await UsersModel.updateOne({email}, {$set: {'emailConfirmation.confirmationCode': newConfirmationCode}});
    }

}