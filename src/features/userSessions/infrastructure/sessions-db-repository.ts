import {deleteSessionByDeviceId} from "../api/controllers/deleteSessionByDeviceId";
import {db} from "../../../common/db/mongo-db";
import {deleteAllSessionsExcludeCurrent} from "../api/controllers/deleteAllSessionExcludeCurrent";
import {UsersSessionsModel} from "../../../common/db/mongoose/mongooseSchemas";

export const sessionDBRepo = {

    async deleteSessionByDeviceId(deviceId: string){
       const result = await UsersSessionsModel.deleteOne({device_id: deviceId})
        if(result.deletedCount === 1 ){ return true }
        return false
    },
    async deleteAllSessionsExcludeCurrent(currentDeviceId: string){
        await UsersSessionsModel.deleteMany({
            device_id: { $ne: currentDeviceId }
        })
    }

}