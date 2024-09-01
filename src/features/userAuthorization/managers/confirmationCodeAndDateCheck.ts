import {db} from "../../../common/db/mongo-db";

export const confirmationCodeAndDateCheck = {
    async checkConfirmationCodeAndExperationDate(confirmationCode: string): Promise<boolean> {
        const user = await db.getCollections().userCollection.findOne({"emailConfirmation.confirmationCode": confirmationCode});
        if(user){
          if(confirmationCode !== user.emailConfirmation.confirmationCode){ return false}
          if(user.emailConfirmation.expirationDate < new Date() ) { return false}
          if(user.emailConfirmation.isConfirmed === true){ return false}
            await db.getCollections().userCollection.updateOne({"emailConfirmation.confirmationCode": confirmationCode}, {$set: {'emailConfirmation.isConfirmed': true}});
          return true
        }
        return false
    }
}