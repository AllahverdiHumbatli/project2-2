import {randomUUID} from "node:crypto";import {ObjectId} from "mongodb";
import {UserDBType} from "../../../common/types/DBtypes";
import {WithId } from 'mongodb'
import {UsersModel, UsersSessionsModel} from "../../../common/db/mongoose/mongooseSchemas";
import {add} from "date-fns";

export class UsersDbRepository {
    async createUser(newUser: UserDBType):Promise<string>{
        const res = await UsersModel.insertMany([newUser])
        return res[0]._id.toString()
    }
    async deleteById (userId: string):Promise<boolean>{
        const res = await UsersModel.deleteOne({_id: new ObjectId(userId)})
        return res.deletedCount === 1;

    }
    async findByLoginOrEmail(loginOrEmail: string):Promise<WithId<UserDBType> | null>{
        return await UsersModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    }
    async findByEmailConfirmationCode(code: string):Promise<WithId<UserDBType> | null>{
        return await UsersModel.findOne({"emailConfirmation.confirmationCode": code});
    }
    async updateEmailConfirmationFlag(code:string):Promise<boolean> {
        const res = await UsersModel.updateOne({"emailConfirmation.confirmationCode": code}, {$set: {'emailConfirmation.isConfirmed': true}});
        if(res.matchedCount === 1){
            return true
        }
        return false
    }
    async findUserById(userId: string):Promise<WithId<UserDBType> | null>{
        return  UsersModel.findOne({_id: new ObjectId(userId)})
    }
    async updateConfirmationCodeByEmail(email: string, newConfirmationCode: string){
        await UsersModel.updateOne({email}, {$set: {'emailConfirmation.confirmationCode': newConfirmationCode}});
    }
    async setPasswordRecoveryCodeForUser(userId: string, recoveryCode: string){
        const res = await UsersModel.updateOne({
            _id: new ObjectId(userId)}, {
            $set: {
                'passwordRecovery.passwordRecoveryCode': recoveryCode,
                'passwordRecovery.expirationDate': add(new Date(), {
                    minutes: 1,
                    seconds: 30
                })

            }})
        if(res.matchedCount === 1){
            return true
        }
        return false
    }

    async getUserByPasswordRecoveryCode(recoveryCode: string){
        const user = await UsersModel.findOne({'passwordRecovery.passwordRecoveryCode': recoveryCode})
        if(!user){
            return false
        }
        return user

    }
    async setNewPasswordAndSetNullForRecoveryCode(userId: string, newPasswordHash: string){
        await UsersModel.updateOne({_id: new ObjectId(userId)}, {$set: {'passwordHash': newPasswordHash}});
        await UsersModel.updateOne({_id: new ObjectId(userId)}, {$set: {'passwordRecovery.passwordRecoveryCode': null}})

    }
}

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
    },
    async setPasswordRecoveryCodeForUser(userId: string, recoveryCode: string){
         const res = await UsersModel.updateOne({
             _id: new ObjectId(userId)}, {
             $set: {
             'passwordRecovery.passwordRecoveryCode': recoveryCode,
                 'passwordRecovery.expirationDate': add(new Date(), {
                     minutes: 1,
                     seconds: 30
                 })

             }})
        if(res.matchedCount === 1){
            return true
        }
        return false
    },

    async getUserByPasswordRecoveryCode(recoveryCode: string){
         const user = await UsersModel.findOne({'passwordRecovery.passwordRecoveryCode': recoveryCode})
         if(!user){
             return false
         }
         return user

    },
    async setNewPasswordAndSetNullForRecoveryCode(userId: string, newPasswordHash: string){
        await UsersModel.updateOne({_id: new ObjectId(userId)}, {$set: {'passwordHash': newPasswordHash}});
        await UsersModel.updateOne({_id: new ObjectId(userId)}, {$set: {'passwordRecovery.passwordRecoveryCode': null}})

    }

}