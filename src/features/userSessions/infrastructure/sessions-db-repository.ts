import {deleteSessionByDeviceId} from "../api/controllers/deleteSessionByDeviceId";
import {deleteAllSessionsExcludeCurrent} from "../api/controllers/deleteAllSessionExcludeCurrent";
import {BlogModel, UsersSessionsModel} from "../../../common/db/mongoose/mongooseSchemas";

export class SessionDBRepo {
    async deleteSessionByDeviceId(deviceId: string){
        const result = await UsersSessionsModel.deleteOne({device_id: deviceId})
        if(result.deletedCount === 1 ){ return true }
        return false
    }
    async deleteAllSessionsExcludeCurrent(currentDeviceId: string){
        await UsersSessionsModel.deleteMany({
            device_id: { $ne: currentDeviceId }
        })
    }
    async deleteAllData(){
        return await UsersSessionsModel.deleteMany({})
    }
}
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