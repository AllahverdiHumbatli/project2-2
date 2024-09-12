
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../../settings";
import {WithId } from 'mongodb'
import {UserDBType} from "../types/DBtypes";
import {usersQueryRepositories} from "../../features/users/api/user-query-repository";
import {usersDbRepository} from "../../features/users/infrastructure/users-db-repository";
export const jwtService = {
    async createJWT(user: WithId<UserDBType>): Promise<{accessToken2: string, refreshToken2: string}> {
        const accessToken2 = jwt.sign({userId: user._id}, SETTINGS.SECRET_KEY, {expiresIn: '10s'});
        const refreshToken2 = jwt.sign({userId: user._id}, SETTINGS.SECRET_KEY, {expiresIn: '20s'});

        return {accessToken2, refreshToken2};
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, SETTINGS.SECRET_KEY) as TokenPayload;
            return result.userId.toString()
        } catch (error) {
            return null
        }
    },
    async verifyToken(token: string): Promise<true | null> {
        try {
            const result = jwt.verify(token, SETTINGS.SECRET_KEY) as TokenPayload;
            return true
        } catch (error) {
            return null
        }
    },
    async createNewTokensByRefreshToken(refreshToken: string):  Promise<{accessToken2: string, refreshToken2: string} | null> {
        const userId = await this.getUserIdByToken(refreshToken);
        if (userId) {
            const user = await usersDbRepository.findUserById(userId);
            return await this.createJWT(user!)
        }
        return null
    }
}

interface TokenPayload {
    userId: string;
}