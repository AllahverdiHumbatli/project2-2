import {SessionDBRepo, sessionDBRepo} from "../infrastructure/sessions-db-repository";
import {deleteAllSessionsExcludeCurrent} from "../api/controllers/deleteAllSessionExcludeCurrent";

export class SessionsService {
    async deleteSessionByDeviceId(deviceId: string): Promise<void> {
        const result = await (new SessionDBRepo()).deleteSessionByDeviceId(deviceId);
    }
    async deleteAllSessionsExcludeCurrent(currentDeviceId: string): Promise<void> {
        await (new SessionDBRepo()).deleteAllSessionsExcludeCurrent(currentDeviceId);
    }
}

export const sessionsService = {
    async deleteSessionByDeviceId(deviceId: string): Promise<void> {
        const result = await (new SessionDBRepo()).deleteSessionByDeviceId(deviceId);
    },
    async deleteAllSessionsExcludeCurrent(currentDeviceId: string): Promise<void> {
        await (new SessionDBRepo()).deleteAllSessionsExcludeCurrent(currentDeviceId);
    }
}