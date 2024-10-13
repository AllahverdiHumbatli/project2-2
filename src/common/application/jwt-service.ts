
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../../settings";
import {WithId } from 'mongodb'
import {UserDBType} from "../types/DBtypes";
import {usersQueryRepositories} from "../../features/users/api/user-query-repository";
import {usersDbRepository} from "../../features/users/infrastructure/users-db-repository";
import { v4 as uuidv4 } from 'uuid';
import {jwtDecode, JwtPayload} from "jwt-decode";
export const jwtService = {
    //get only user Id not all user data
    async createJWT(user: WithId<UserDBType>, dId?: string): Promise<{accessToken: string, refreshToken: string}> {
        const uuid: string = uuidv4();
        const accessToken = jwt.sign({userId: user._id}, SETTINGS.SECRET_KEY, {expiresIn: '10s'});
        const refreshToken = jwt.sign({userId: user._id, deviceId: dId !== undefined? dId : uuid}, SETTINGS.SECRET_KEY, {expiresIn: '20s'});

        return {accessToken, refreshToken};
    },
    getUserIdByAccessToken(token: string): string | null {
        try {
            const result = jwt.verify(token, SETTINGS.SECRET_KEY) as TokenPayload;
            return result.userId.toString()
        } catch (error) {
            return null
        }
    },
    async getTokenPayload(token: string): Promise<JwtPayload | null> {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken
        } catch (error) {
            return null
        }
    },
    async verifyToken(token: string): Promise<true | null> {
        try {
            const result = jwt.verify(token, SETTINGS.SECRET_KEY)
            return true
        } catch (error) {
            return null
        }
    },
    async createNewTokensByRefreshToken(refreshToken: string):  Promise<{accessToken: string, refreshToken: string} | null> {
        const userId = await this.getUserIdByAccessToken(refreshToken);
        const tokenPayload = await this.getTokenPayload(refreshToken);
        const deviceId = tokenPayload!.deviceId

        if (userId) {
            const user = await usersDbRepository.findUserById(userId);
            return await this.createJWT(user!, deviceId)
        }
        return null
    }
}

interface TokenPayload {
    userId: string;
    deviceId: string;
}

//test for git