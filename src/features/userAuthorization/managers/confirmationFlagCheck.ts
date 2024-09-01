import {db} from "../../../common/db/mongo-db";
import { ObjectId } from 'mongodb';
export const confirmationFlagCheck = {
    async isConfirmed(userId: string): Promise<boolean | null> {
        const userDBdata = await db.getCollections().userCollection.findOne({_id: new ObjectId(userId)})
        if(userDBdata) {
            if(userDBdata.emailConfirmation.isConfirmed === true){
                return true
            }
            return false
        }
     return null
    }
}