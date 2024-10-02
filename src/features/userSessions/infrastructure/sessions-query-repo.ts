import {db} from "../../../common/db/mongo-db";

export const sessionsQueryRepo = {
    async getAllSessionsForUser(userId: string) {
        const sessionsDBtype =  await db.getCollections().usersSessionsCollection.find({"user_id": userId}).toArray();
        return sessionsDBtype.map(session => ({
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: new Date(session.iat * 1000).toISOString(),
            deviceId: session.device_id,
        }));
    }
}