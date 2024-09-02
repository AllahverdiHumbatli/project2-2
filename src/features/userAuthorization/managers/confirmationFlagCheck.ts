import {db} from "../../../common/db/mongo-db";
import { ObjectId } from 'mongodb';
import {usersDbRepository} from "../../users/infrastructure/users-db-repository";
import {UserDBType} from "../../../common/types/DBtypes";
import {WithId } from 'mongodb'
export const confirmationFlagCheck = {
    async isConfirmed(userId: string): Promise<boolean | null> {
        const user: WithId<UserDBType> | null = await usersDbRepository.findUserById(userId)
        if(user) {
            if(user.emailConfirmation.isConfirmed === true){
                return true
            }
            return false
        }
     return null
    }
}