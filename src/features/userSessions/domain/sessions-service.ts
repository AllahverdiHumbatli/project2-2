import {sessionDBRepo} from "../infrastructure/sessions-db-repository";
import {deleteAllSessionsExcludeCurrent} from "../api/controllers/deleteAllSessionExcludeCurrent";

export const sessionsService = {
    async deleteSessionByDeviceId(deviceId: string): Promise<void> {
        const result = await sessionDBRepo.deleteSessionByDeviceId(deviceId);
    },
    async deleteAllSessionsExcludeCurrent(currentDeviceId: string): Promise<void> {
        await sessionDBRepo.deleteAllSessionsExcludeCurrent(currentDeviceId);
    }
}