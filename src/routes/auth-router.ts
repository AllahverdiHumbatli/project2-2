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
import {requestLimitMiddleware} from "../common/global-middlewares/rateLimitMiddleWare";
import {validateEmail} from "../features/userAuthorization/api/middlewares/validatorForEmail";
import {passwordRecovery} from "../features/userAuthorization/api/contollers/password-recovery";

import {setNewPassword} from "../features/userAuthorization/api/contollers/new-password";
import {newPasswordValidator} from "../features/userAuthorization/api/middlewares/passwordValidator";
import {recoveryCodeValidator} from "../features/userAuthorization/api/middlewares/recoveryCodeValidator";

export const authRouter = Router()

authRouter.post('/login', requestLimitMiddleware, checkLoginAndGiveToken)
authRouter.post('/refresh-token', refreshTokens)
authRouter.post('/logout', revokeToken )
authRouter.post('/password-recovery', requestLimitMiddleware, validateEmail, passwordRecovery )
authRouter.post('/new-password', requestLimitMiddleware,newPasswordValidator, recoveryCodeValidator, inputCheckErrorsMiddleware, setNewPassword )

authRouter.get('/me',  authMiddleware, getCurrentUserData)
authRouter.post('/registration', requestLimitMiddleware ,loginValidator, passwordValidator, emailValidator, inputCheckErrorsMiddleware, registrationUser )
authRouter.post('/registration-confirmation', requestLimitMiddleware, confirmationRegistration)
authRouter.post('/registration-email-resending', requestLimitMiddleware,emailValidator, inputCheckErrorsMiddleware, emailResending )