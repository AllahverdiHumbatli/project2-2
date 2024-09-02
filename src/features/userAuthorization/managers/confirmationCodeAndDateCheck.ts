import {db} from "../../../common/db/mongo-db";
import {usersDbRepository} from "../../users/infrastructure/users-db-repository";
import {UserDBType} from "../../../common/types/DBtypes";
import {WithId } from 'mongodb'
export const confirmationCodeAndDateCheck = {
    async checkConfirmationCodeAndExperationDate(confirmationCode: string): Promise<boolean> {
        const user: WithId<UserDBType> | null =  await usersDbRepository.findByEmailConfirmationCode(confirmationCode);
        if(user){
          if(confirmationCode !== user.emailConfirmation.confirmationCode){ return false}
          if(user.emailConfirmation.expirationDate < new Date() ) { return false}
          if(user.emailConfirmation.isConfirmed === true){ return false}
          await usersDbRepository.updateEmailConfirmationFlag(confirmationCode)
          return true
        }
        return false
    }
}