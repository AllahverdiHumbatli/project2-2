import express, {Router} from "express";
import {getAllSessionsForUser} from "../features/users/api/contollers/getSessions";
import {deleteAllSessionsExcludeCurrent} from "../features/users/api/contollers/deleteAllSessionExcludeCurrent";
import {deleteSessionByDeviceId} from "../features/users/api/contollers/deleteSessionByDeviceId";
import {authMiddleware} from "../common/global-middlewares/authMiddleWare";

export const securityRouter = Router()

securityRouter.get('/', getAllSessionsForUser )
//deleteAllSessionsExcludeCurrent
securityRouter.delete('/', deleteAllSessionsExcludeCurrent)
securityRouter.delete('/:id', authMiddleware, deleteSessionByDeviceId)
// deleteSessionByDeviceId