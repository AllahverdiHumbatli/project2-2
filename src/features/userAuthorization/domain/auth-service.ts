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
import {UsersModel, UsersSessionsModel} from "../../../common/db/mongoose/mongooseSchemas";
// "../domain/comments-service";
export class AuthorizationService {
    async registerUser(login: string, password: string, email: string, isConfirmed: boolean): Promise<any> {
        return await usersService.createUser({login, password, email, isConfirmed})
        //add emailConfirm
        //send email
    }
    async createUserByAdmin(login: string, password: string, email: string, isConfirmed: boolean): Promise<any> {
        return await usersService.createUser({login, password, email, isConfirmed})
        //send sms for admin
    }
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

    async sendEmailForRecoveryPassword(email: string){
        const recoveryCodeForPassword = randomUUID()
        const user = await usersDbRepository.findByLoginOrEmail(email)
        if(!user){
            return {
                data: { errorsMessages: [{ message: "email doesnt exist", field: "email" } ] },
                statusCode: StatusCode.emailNotExist
            }
        }
        await usersDbRepository.setPasswordRecoveryCodeForUser(user._id.toString(), recoveryCodeForPassword)
        this.sendEmailForPasswordRecovery(email, recoveryCodeForPassword)
        return {
            data: null,
            statusCode: StatusCode.noContent
        }

    }
    async setNewPassword(newPassword: string, recoveryCodeForPassword: string): Promise<any> {
        const user = await usersDbRepository.getUserByPasswordRecoveryCode(recoveryCodeForPassword)
        if(!user){
            return {
                data: { errorsMessages: [{ message: "recovery code doesnt exist", field: "recovery code" } ] },
                statusCode: StatusCode.NotFound
            }
        }
        if(user.passwordRecovery.expirationDate! < new Date()){
            return  {
                data: { errorsMessages: [{ message: "recovery code expired", field: "recovery code" } ] },
                statusCode: StatusCode.Forbidden
            }
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, passwordSalt);

        await usersDbRepository.setNewPasswordAndSetNullForRecoveryCode(user._id.toString(), passwordHash)

        return {
            data: null,
            statusCode: StatusCode.noContent
        }


    }
    async sendEmail(email: string, code: string):Promise<boolean>{
        return await emailAdapter.sendEmail(email, code);
    }
    async sendEmailForPasswordRecovery(email: string, code: string):Promise<boolean> {
        return await emailAdapter.sendEmailForRecoveryPassword(email, code);

    }
    async confirmUser(code: string):Promise<boolean >{
        return await confirmationCodeAndDateCheck.checkConfirmationCodeAndExperationDate(code)
    }


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

        await UsersSessionsModel.insertMany([session])
        //ToDo
        // how to set sesion into DB +
        // More than 5 attempts from one IP-address during 10 seconds   some auth endpoints
        //delete validation for login from loginController


        return {accessToken, refreshToken}
    }
    async isTokenInvalidByIat(tokenPayload: JwtPayload): Promise<boolean> {
        // const deviceId = tokenPayload!.deviceId
        // const iat = tokenPayload.iat
        return  !(await UsersSessionsModel
            .findOne({device_id: tokenPayload.deviceId, iat: tokenPayload.iat}))
        // if(isInvalid){
        //     return false
        // }
        // return true
    }
    async isDeviceIdExist(deviceId:string): Promise<false|WithId<SessionDBType>> {

        // const isExist = await db.getCollections().usersSessionsCollection.findOne({device_id: deviceId})
        // if(isExist){
        //     return isExist
        // }
        // return false
        return (await UsersSessionsModel.findOne({device_id: deviceId})) ?? false
    }

}
///////////////////////////////////////////////////////////////////////////
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
    async sendEmailForRecoveryPassword(email: string){
        const recoveryCodeForPassword = randomUUID()
        const user = await usersDbRepository.findByLoginOrEmail(email)
        if(!user){
            return {
                data: { errorsMessages: [{ message: "email doesnt exist", field: "email" } ] },
                statusCode: StatusCode.emailNotExist
            }
        }
        await usersDbRepository.setPasswordRecoveryCodeForUser(user._id.toString(), recoveryCodeForPassword)
        this.sendEmailForPasswordRecovery(email, recoveryCodeForPassword)
        return {
            data: null,
            statusCode: StatusCode.noContent
        }

    },
    async setNewPassword(newPassword: string, recoveryCodeForPassword: string): Promise<any> {
          const user = await usersDbRepository.getUserByPasswordRecoveryCode(recoveryCodeForPassword)
          if(!user){
              return {
                  data: { errorsMessages: [{ message: "recovery code doesnt exist", field: "recovery code" } ] },
                  statusCode: StatusCode.NotFound
              }
          }
          if(user.passwordRecovery.expirationDate! < new Date()){
            return  {
                  data: { errorsMessages: [{ message: "recovery code expired", field: "recovery code" } ] },
                  statusCode: StatusCode.Forbidden
              }
          }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, passwordSalt);

        await usersDbRepository.setNewPasswordAndSetNullForRecoveryCode(user._id.toString(), passwordHash)

         return {
            data: null,
            statusCode: StatusCode.noContent
        }


    },
    async sendEmail(email: string, code: string):Promise<boolean>{
        return await emailAdapter.sendEmail(email, code);
    },
    async sendEmailForPasswordRecovery(email: string, code: string):Promise<boolean> {
        return await emailAdapter.sendEmailForRecoveryPassword(email, code);

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

        await UsersSessionsModel.insertMany([session])
            //ToDo
            // how to set sesion into DB +
        // More than 5 attempts from one IP-address during 10 seconds   some auth endpoints
        //delete validation for login from loginController


        return {accessToken, refreshToken}
    },
    async isTokenInvalidByIat(tokenPayload: JwtPayload): Promise<boolean> {
        // const deviceId = tokenPayload!.deviceId
        // const iat = tokenPayload.iat
        return  !(await UsersSessionsModel
            .findOne({device_id: tokenPayload.deviceId, iat: tokenPayload.iat}))
        // if(isInvalid){
        //     return false
        // }
        // return true
    },
    async isDeviceIdExist(deviceId:string): Promise<false|WithId<SessionDBType>> {

        // const isExist = await db.getCollections().usersSessionsCollection.findOne({device_id: deviceId})
        // if(isExist){
        //     return isExist
        // }
        // return false
        return (await UsersSessionsModel.findOne({device_id: deviceId})) ?? false
    }

}