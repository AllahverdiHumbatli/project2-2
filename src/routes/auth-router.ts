import {Router} from "express";
import {checkLoginAndGiveToken} from "../features/userAuthorization/api/contollers/loginController";
import {authMiddleware} from "../common/global-middlewares/authMiddleWare";
import {getCurrentUserData} from "../features/users/api/contollers/getUserData";
import {adminMiddleWare} from "../common/global-middlewares/adminMiddleWare";
import {loginValidator} from "../features/users/api/middlewares/loginValidator";
import {passwordValidator} from "../features/users/api/middlewares/passwordValidator";
import {emailValidator} from "../features/users/api/middlewares/emailValidator";
import {inputCheckErrorsMiddleware} from "../common/global-middlewares/globalMiddleWare";
import {registrationUser} from "../features/userAuthorization/api/contollers/registrationController";
import {
    confirmationRegistration
} from "../features/userAuthorization/api/contollers/confirmationRegistration";
import {emailResending} from "../features/userAuthorization/api/contollers/emailResending";
import {refreshTokens} from "../features/userAuthorization/api/contollers/refresh-token";
import {revokeToken} from "../features/userAuthorization/api/contollers/revokeToken";

export const authRouter = Router()

authRouter.post('/login', checkLoginAndGiveToken)
authRouter.post('/refresh-token', refreshTokens)
authRouter.post('/logout', revokeToken )

authRouter.get('/me',  authMiddleware, getCurrentUserData)
authRouter.post('/registration', loginValidator, passwordValidator, emailValidator, inputCheckErrorsMiddleware, registrationUser )
authRouter.post('/registration-confirmation', confirmationRegistration)
authRouter.post('/registration-email-resending', emailValidator, inputCheckErrorsMiddleware, emailResending )