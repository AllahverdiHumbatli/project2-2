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
            await authService.sendEmail(user.email, newConfirmationCode);

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
    }

}