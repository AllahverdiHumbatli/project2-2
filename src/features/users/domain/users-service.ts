import {body} from "express-validator"
import {UsersDbRepository, usersDbRepository} from "../infrastructure/users-db-repository";
import {db} from "../../../common/db/mongo-db";
import * as bcrypt from 'bcrypt'
import {WithId, ObjectId } from 'mongodb';
import {ValidationErrorForLoginEmail} from "../api/view-models/UserViewModels";
import {UserDBType} from "../../../common/types/DBtypes";
import {isDataUnique} from "./uniqueCheck";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import { confirmationFlagCheck} from "../../userAuthorization/managers/confirmationFlagCheck";
import {AuthorizationService, authService} from "../../userAuthorization/domain/auth-service";

///auth-service and bcrypt-service
export class UserService {
    usersDbRepository: UsersDbRepository;
    constructor() {
        this.usersDbRepository = new UsersDbRepository()
    }
    async createUser({login, password, email, isConfirmed}:{login:string, password:string, email:string, isConfirmed:boolean}):Promise<string|ValidationErrorForLoginEmail> {

        const isUnique:string|ValidationErrorForLoginEmail = await isDataUnique(login, email);
        if(isUnique !== "it's unique") return isUnique //RETURN ARRAY

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        const newUser = {
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordRecovery:{
                passwordRecoveryCode: null,
                expirationDate: null
            },
            emailConfirmation: {    // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                isConfirmed
            }
        }

        const userId: string = await this.usersDbRepository.createUser(newUser)

        if(isConfirmed){
            return userId
        }

        const res = (new AuthorizationService()).sendEmail(email, newUser.emailConfirmation.confirmationCode)

        res.catch((e) => { console.log(e) })

        return userId


    }
    async  deleteById(id: string):Promise<boolean> {
        console.log("айдишка юзера в сервисе", id)
        return await this.usersDbRepository.deleteById(id)
    }
    async checkCredentials(loginOrEmail: string, password: string):Promise<WithId<UserDBType> | null> {
        const user:WithId<UserDBType> | null = await this.usersDbRepository.findByLoginOrEmail(loginOrEmail)
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

/////////////////////////////////////////////////
 export const usersService = {
    async createUser({login, password, email, isConfirmed}:{login:string, password:string, email:string, isConfirmed:boolean}):Promise<string|ValidationErrorForLoginEmail> {

         const isUnique:string|ValidationErrorForLoginEmail = await isDataUnique(login, email);
         if(isUnique !== "it's unique") return isUnique //RETURN ARRAY

         const passwordSalt = await bcrypt.genSalt(10);
         const passwordHash = await bcrypt.hash(password, passwordSalt);

        const newUser = {
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordRecovery:{
                passwordRecoveryCode: null,
                expirationDate: null
            },
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

        if(isConfirmed){
            return userId
        }

       const res = (new AuthorizationService()).sendEmail(email, newUser.emailConfirmation.confirmationCode)

        res.catch((e) => { console.log(e) })

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