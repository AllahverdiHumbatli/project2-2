import {ValidationErrorForLoginEmail} from "../../users/api/view-models/UserViewModels";
import {isDataUnique} from "../../users/domain/uniqueCheck";
import * as bcrypt from "bcrypt";
import {usersDbRepository} from "../../users/infrastructure/users-db-repository";
import {usersService} from "../../users/domain/users-service";
import { emailAdapter} from "../adapters/email-adapter";
import {confirmationCodeAndDateCheck} from "../managers/confirmationCodeAndDateCheck";
import {db} from "../../../common/db/mongo-db";
import {confirmationFlagCheck} from "../managers/confirmationFlagCheck";
import {StatusCode} from "../../comments/domain/comments-service";
import {randomUUID} from "node:crypto";
import {Result} from "../../comments/domain/comments-service";
import {WithId} from "mongodb";
import {SessionDBType, UserDBType} from "../../../common/types/DBtypes";
import {jwtService} from "../../../common/application/jwt-service";
import jwt from "jsonwebtoken";
import {JwtPayload} from "jwt-decode";
// "../domain/comments-service";
export const authService = {
    async registerUser(login: string, password: string, email: string, isConfirmed: boolean): Promise<any> {
        return await usersService.createUser({login, password, email, isConfirmed})
        //add emailConfirm
        //send email
    },
    async createUserByAdmin(login: string, password: string, email: string, isConfirmed: boolean): Promise<any> {
        return await usersService.createUser({login, password, email, isConfirmed})
        //send sms for admin
    },
    async emailResending(email:string):Promise<Result<null|{ errorsMessages:[{ message: string, field: string} ]}>> {
        const user = await usersDbRepository.findByLoginOrEmail(email)
        if(user){
            const userId = user._id.toString()
            const isConfirmed = await confirmationFlagCheck.isConfirmed(userId)
            if(isConfirmed){
                return {
                    data: { errorsMessages: [{ message: "email is already confirmed", field: "email" } ] },
                    statusCode: StatusCode.userAlreadyConfirmed
                }
            }

            const newConfirmationCode = randomUUID()
            await usersDbRepository.updateConfirmationCodeByEmail(email, newConfirmationCode)
             this.sendEmail(user.email, newConfirmationCode);

            return {
                data: null,
                statusCode: StatusCode.noContent
            }
    }
        return {
            data: { errorsMessages: [{ message: "email doesnt exist", field: "email" } ] },
            statusCode: StatusCode.emailNotExist
        }

        }
    ,
    async sendEmail(email: string, code: string):Promise<boolean>{
        console.log("Sending email", email);
        return await emailAdapter.sendEmail(email, code);
    },
    async confirmUser(code: string):Promise<boolean >{
          return await confirmationCodeAndDateCheck.checkConfirmationCodeAndExperationDate(code)
    },
    async createSession(user: WithId<UserDBType>, ip: string, userAgent: string): Promise<{accessToken: string, refreshToken: string}> {
        const {accessToken, refreshToken} = await jwtService.createJWT(user)
        const tokenPayload = await jwtService.getTokenPayload(refreshToken)

        const session = {
            user_id: tokenPayload!.userId,
            ip: ip,
            device_name: userAgent,
            iat: tokenPayload!.iat,
            exp: tokenPayload!.exp,
            device_id: tokenPayload!.deviceId
        }
        // user_id: string,
        //     device_id: string,
        //     iat: number,
        //     device_name: string,
        //     ip: string,
        //     exp: number

        await db.getCollections().usersSessionsCollection.insertOne(session)
            //to do
            // how to set sesion into DB +
        // More than 5 attempts from one IP-address during 10 seconds   some auth endpoints
        //delete validation for login from loginController

        console.log(session);

        return {accessToken, refreshToken}
    },
    async isTokenInvalidByIat(tokenPayload: JwtPayload): Promise<boolean> {
        const deviceId = tokenPayload!.deviceId
        const iat = tokenPayload!.iat
        const isInvalid = await db.getCollections().usersSessionsCollection.findOne({device_id: deviceId, iat: iat})
        if(isInvalid){
            return false
        }
        return true
    },
    async isDeviceIdExist(deviceId:string): Promise<false|WithId<SessionDBType>> {

        const isExist = await db.getCollections().usersSessionsCollection.findOne({device_id: deviceId})
        if(isExist){
            return isExist
        }
        return false
    }

}