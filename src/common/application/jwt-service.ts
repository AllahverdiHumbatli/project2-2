
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../../settings";
import {WithId } from 'mongodb'
import {UserDBType} from "../types/DBtypes";
export const jwtService = {
    async createJWT(user:  WithId<UserDBType>){
    const token =  jwt.sign({userId: user._id}, SETTINGS.SECRET_KEY, {expiresIn: '2h'});
    return token
},
    async getUserIdByToken (token: string): Promise<string | null>{
        try {
            const result= jwt.verify(token, SETTINGS.SECRET_KEY)  as TokenPayload;
            return result.userId.toString()
        }
        catch (error){
            return null
        }
}
}

interface TokenPayload {
    userId: string;
}