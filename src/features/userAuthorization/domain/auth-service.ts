import {ValidationErrorForLoginEmail} from "../../users/api/view-models/UserViewModels";
import {isDataUnique} from "../../users/domain/uniqueCheck";
import * as bcrypt from "bcrypt";
import {usersDbRepository} from "../../users/infrastructure/users-db-repository";
import {usersService} from "../../users/domain/users-service";
import { emailAdapter} from "../adapters/email-adapter";
import {confirmationCodeAndDateCheck} from "../managers/confirmationCodeAndDateCheck";

export const authService = {
    async registerUser(login: string, password: string, email: string, isConfirmed: boolean): Promise<any> {
        return await usersService.createUser(login, password, email, isConfirmed)
    },
    async sendEmail(email: string, code: string):Promise<boolean>{
        console.log("Sending email", email);
        return await emailAdapter.sendEmail(email, code);
    },
    async confirmUser(code: string):Promise<boolean >{
          return await confirmationCodeAndDateCheck.checkConfirmationCodeAndExperationDate(code)
    }

}