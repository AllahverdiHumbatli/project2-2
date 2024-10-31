import {Request, Response} from "express";
import {WithId} from "mongodb";
import {UserDBType} from "../../../../common/types/DBtypes";
import {UserService, usersService} from "../../../users/domain/users-service";
import {AuthorizationService, authService} from "../../domain/auth-service";
import {jwtService} from "../../../../common/application/jwt-service";
import {UsersSessionsModel} from "../../../../common/db/mongoose/mongooseSchemas";
import {StatusCode} from "../../../comments/domain/comments-service";
import {CurrentUserViewModel} from "../../../users/api/view-models/UserViewModels";
import {UserQueryRepository, usersQueryRepositories} from "../../../users/api/user-query-repository";

class AuthorizationController {
    authService: AuthorizationService
    constructor() {
        this.authService = new AuthorizationService();
    }
    async checkLoginAndGiveToken  (req: Request, res: Response)  {

        if(typeof req.body.loginOrEmail !==  "string"){
            return res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "not string",
                        "field": "loginOrEmail"
                    }
                ]
            });
        }
        if(typeof req.body.password !==  "string"){
            return res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "not string",
                        "field": "password"
                    }
                ]
            });
        }

        const user:WithId<UserDBType> | null = await (new UserService()).checkCredentials(req.body.loginOrEmail, req.body.password);

        if(user) {
            const ip  = req.ip || "127.0.0.1";
            const userAgent = req.headers['user-agent']|| 'Unknown User-Agent';
            const {accessToken, refreshToken} = await this.authService.createSession(user, ip, userAgent )
            return res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true}).status(200).send({
                accessToken
            });
        }
        return res.sendStatus(401)
    }
    async registrationUser  (req: Request, res: Response) {
        let isConfirmed = false
        const newUserId = await this.authService.registerUser(req.body.login, req.body.password, req.body.email, isConfirmed)
        if(Array.isArray(newUserId)){
            res.status(400).send({ errorsMessages: [ newUserId[0] ] })
            return
        }
        res.sendStatus(204)
        return
        // const newUserData = authService.createUserWithoutAuth(req.body.login, req.body.email, req.body.password,)
    }
     async confirmationRegistration (req: Request, res: Response)  {
        const  code  = req.body.code
        const isUserConfirmedEmail:boolean = await this.authService.confirmUser(code)
        if(isUserConfirmedEmail === false){
            return res.status(400).send({ errorsMessages: [{ message: "code error", field: "code" } ] });
        }
        return res.sendStatus(204)

    }
    async refreshTokens(req: Request, res: Response)  {

        const usedRefreshToken = req.cookies['refreshToken'];

        if (!usedRefreshToken) {
            return res.sendStatus(401);
        }
        const isExpaired = await jwtService.verifyToken(usedRefreshToken)
        if(!isExpaired) {
            return res.sendStatus(401);
        }
        const usedTokenPayload = await jwtService.getTokenPayload(usedRefreshToken)
        const userSession =
            await UsersSessionsModel
                .findOne({"user_id": usedTokenPayload?.userId, "iat": usedTokenPayload?.iat})
        if(!userSession) {
            return res.sendStatus(401);
        }

        const result = await jwtService.createNewTokensByRefreshToken(usedRefreshToken);
        if(result){
            const {accessToken, refreshToken} = result

            const newTokenPayload = await jwtService.getTokenPayload(refreshToken)

            await UsersSessionsModel.updateOne({
                "device_id": newTokenPayload!.deviceId}, {$set: {"iat" : newTokenPayload!.iat}
            });
            return res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true}).status(200).send({
                "accessToken": accessToken
            });
        }
        return res.sendStatus(401);
    }
    async passwordRecovery(req: Request, res: Response) {
        const email = req.body.email
        const result = await this.authService.sendEmailForRecoveryPassword(email)

        if (result.statusCode === StatusCode.noContent) {
            return res.sendStatus(204)
        }
        console.log(" current email is not registered")
        return res.sendStatus(204)
    }
    async setNewPassword(req: Request, res: Response)  {
        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode
        const result = await this.authService.setNewPassword(newPassword, recoveryCode)

        if (result.statusCode === StatusCode.NotFound || result.statusCode === StatusCode.Forbidden) {
            return res.status(400).json({ errorsMessages: [{ message: "recoveryCode", field: "recoveryCode" }] });
        }
        console.log(" current email is not registered")
        return res.sendStatus(204)
    }
    async emailResending  (req: Request, res: Response)  {
        const email = req.body.email
        const result = await this.authService.emailResending(email)
        if (result.statusCode === StatusCode.userAlreadyConfirmed) {
            return res.status(400).send(result.data)
        }
        if (result.statusCode === StatusCode.noContent) {
            return res.sendStatus(204)
        }

        return res.status(400).send(result.data)

    }
    async revokeToken  (req: Request, res: Response)  {
        const refreshToken: string = req.cookies['refreshToken'];
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        const isExpaired = await jwtService.verifyToken(refreshToken)
        if(!isExpaired) {

            return res.sendStatus(401);
        }

        const tokenPayload = await jwtService.getTokenPayload(refreshToken)
        const isTokenValidByIat = await this.authService.isTokenInvalidByIat(tokenPayload!)
        if(isTokenValidByIat) {

            return res.sendStatus(401);
        }

        // const tokenToInsert: ExpiredRefreshTokens = { refreshToken };
        // await db.getCollections().expiredRefreshTokenCollection.insertOne(tokenToInsert)
        await UsersSessionsModel.deleteOne({
            device_id: tokenPayload!.deviceId, iat: tokenPayload!.iat})


        return res.sendStatus(204);
    }
    async getCurrentUserData (req: Request, res: Response)  {
        const currentUserData:CurrentUserViewModel = await (new UserQueryRepository()).getCurrentUser(req.user.id)
        if(currentUserData){
            res.status(200).send(currentUserData)
            return
        }
        res.sendStatus(401)
        return
    }

}
export const authorizationController = new AuthorizationController()