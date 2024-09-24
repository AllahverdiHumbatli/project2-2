import express from 'express'
import cors from 'cors'
import { blogsRouter} from "./routes/blogs-router";
import { postsRouter} from "./routes/posts-router";
import {deleteAlldata} from "./common/globalDeteleMethod/deleteAll";
import {usersRouter} from "./routes/users-router";
import {checkLoginAndGiveToken} from "./features/userAuthorization/api/contollers/loginController";
import {feedbacksRouter} from "./routes/feedbacks-router";
import {authMiddleware} from "./common/global-middlewares/authMiddleWare";
import {getCurrentUserData} from "./features/users/api/contollers/getUserData";
import {authRouter} from "./routes/auth-router";
import cookieParser from 'cookie-parser';
import {securityRouter} from "./routes/security-router";

export const initApp = () => {
    const app = express() // создать приложение
    app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
    app.use(cookieParser());
    app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

    app.delete("/testing/all-data", deleteAlldata)
    app.use("/blogs", blogsRouter)
    app.use("/posts", postsRouter)
    app.use('/users', usersRouter)
    app.use('/comments', feedbacksRouter)
    app.use('/auth', authRouter)
    app.use('/security/devices', securityRouter )

    return app
}

