import express, {Router} from "express";
import {getAllSessionsForUser} from "../features/userSessions/api/controllers/getSessions";
import {deleteAllSessionsExcludeCurrent} from "../features/userSessions/api/controllers/deleteAllSessionExcludeCurrent";
import {deleteSessionByDeviceId} from "../features/userSessions/api/controllers/deleteSessionByDeviceId";
import {authMiddleware} from "../common/global-middlewares/authMiddleWare";
import {authForRefreshToken} from "../common/global-middlewares/authForRefreshToken";
import {sessionController} from "../features/userSessions/api/controllers/sessionsController";

export const securityRouter = Router()

securityRouter.get('/',authForRefreshToken, sessionController.getAllSessionsForUser.bind(sessionController) )
//deleteAllSessionsExcludeCurrent
securityRouter.delete('/', authForRefreshToken, sessionController.deleteAllSessionsExcludeCurrent.bind(sessionController))
securityRouter.delete('/:id', authForRefreshToken, sessionController.deleteSessionByDeviceId.bind(sessionController))
// deleteSessionByDeviceId