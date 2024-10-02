import {deleteSessionByDeviceId} from "../api/controllers/deleteSessionByDeviceId";
import {db} from "../../../common/db/mongo-db";
import {deleteAllSessionsExcludeCurrent} from "../api/controllers/deleteAllSessionExcludeCurrent";

export const sessionDBRepo = {

    async deleteSessionByDeviceId(deviceId: string){
       const result = await db.getCollections().usersSessionsCollection.deleteOne({device_id: deviceId})
        if(result.deletedCount === 1 ){ return true }
        return false
    },
    async deleteAllSessionsExcludeCurrent(currentDeviceId: string){
        await db.getCollections().usersSessionsCollection.deleteMany({
            device_id: { $ne: currentDeviceId }
        })
    }

}