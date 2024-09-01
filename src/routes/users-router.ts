import {Router} from "express";
import {adminMiddleWare} from "../common/global-middlewares/adminMiddleWare";
import {loginValidator} from "../features/users/api/middlewares/loginValidator";
import {passwordValidator} from "../features/users/api/middlewares/passwordValidator";
import {postUser} from "../features/users/api/contollers/postContoller";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {emailValidator} from "../features/users/api/middlewares/emailValidator";
import {getUsers} from "../features/users/api/contollers/getController";
import {deleteUserById} from "../features/users/api/contollers/deleteByIdController";

export const usersRouter = Router()

usersRouter.get('/', adminMiddleWare, getUsers )
usersRouter.post('/',adminMiddleWare, loginValidator, passwordValidator, emailValidator, inputCheckErrorsMiddleware, postUser )
usersRouter.delete('/:id', adminMiddleWare, deleteUserById)
