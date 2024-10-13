import {db} from "../../../common/db/mongo-db";
import {UsersSessionsModel} from "../../../common/db/mongoose/mongooseSchemas";

export const sessionsQueryRepo = {
    async getAllSessionsForUser(userId: string) {
        const sessionsDBtype =  await UsersSessionsModel.find({"user_id": userId}).lean();
        console.log('this is session:!!!!!!', sessionsDBtype);

        return sessionsDBtype.map(session => ({
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: new Date(session.iat * 1000).toISOString(),
            deviceId: session.device_id,
        }));
    }
}