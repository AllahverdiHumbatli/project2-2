import {body} from "express-validator"
import {usersDbRepository} from "../infrastructure/users-db-repository";
import {db} from "../../../common/db/mongo-db";
import * as bcrypt from 'bcrypt'
import {WithId, ObjectId } from 'mongodb';
import {ValidationErrorForLoginEmail} from "../api/view-models/UserViewModels";
import {UserDBType} from "../../../common/types/DBtypes";
import {isDataUnique} from "./uniqueCheck";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import { confirmationFlagCheck} from "../../userAuthorization/managers/confirmationFlagCheck";
import {authService} from "../../userAuthorization/domain/auth-service";


 export const usersService = {
    async createUser(login: string, password: string, email: string, isConfirmed: boolean):Promise<string|ValidationErrorForLoginEmail> {

         const isUnique:string|ValidationErrorForLoginEmail = await isDataUnique(login, email);
         if(isUnique !== "it's unique") return isUnique //RETURN ARRAY

         const passwordSalt = await bcrypt.genSalt(10);
         const passwordHash = await bcrypt.hash(password, passwordSalt);

        const newUser = {
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash,
            emailConfirmation: {    // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                isConfirmed
            }
        }

        const userId: string = await usersDbRepository.createUser(newUser)
        const isConfirmedInDB = await confirmationFlagCheck.isConfirmed(userId)

        if(isConfirmedInDB === true){
            return userId
        }

        const sendEmail :boolean = await authService.sendEmail(email, newUser.emailConfirmation.confirmationCode)
        if(sendEmail){
            return userId
        }
        return userId


    },
   async  deleteById(id: string):Promise<boolean> {
       console.log("айдишка юзера в сервисе", id)
        return await usersDbRepository.deleteById(id)
   },
   async checkCredentials(loginOrEmail: string, password: string):Promise<WithId<UserDBType> | null> {
        const user:WithId<UserDBType> | null = await usersDbRepository.findByLoginOrEmail(loginOrEmail)
        if (!user){
            return null
        }
        const isCorrect: boolean = await bcrypt.compare(password, user.passwordHash)
       if (isCorrect){
           return user
       }
       return null

   }
 }