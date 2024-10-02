import express, {Router} from "express";
import {getAllSessionsForUser} from "../features/userSessions/api/controllers/getSessions";
import {deleteAllSessionsExcludeCurrent} from "../features/userSessions/api/controllers/deleteAllSessionExcludeCurrent";
import {deleteSessionByDeviceId} from "../features/userSessions/api/controllers/deleteSessionByDeviceId";
import {authMiddleware} from "../common/global-middlewares/authMiddleWare";
import {authForRefreshToken} from "../common/global-middlewares/authForRefreshToken";

export const securityRouter = Router()

securityRouter.get('/',authForRefreshToken, getAllSessionsForUser )
//deleteAllSessionsExcludeCurrent
securityRouter.delete('/', authForRefreshToken, deleteAllSessionsExcludeCurrent)
securityRouter.delete('/:id', authForRefreshToken, deleteSessionByDeviceId)
// deleteSessionByDeviceId