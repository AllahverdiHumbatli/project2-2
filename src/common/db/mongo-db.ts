import dotenv from 'dotenv'
import {SETTINGS} from "../../settings";
import {MongoClient, Collection, Db} from "mongodb";
import {BlogDBType, ExpiredRefreshTokens, PostDBType, rateLimits, SessionDBType, UserDBType} from "../types/DBtypes";
import {FeedBackDBType} from "../types/DBtypes";


dotenv.config()


// // получение доступа к бд
// export const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
// export const db = client.db();
//
// // получение доступа к коллекциям
// export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME)
// export const postCollection: Collection<PostDBType> = db.collection<PostDBType>(SETTINGS.POST_COLLECTION_NAME)
// export const userCollection: Collection<UserDBType> = db.collection<UserDBType>(SETTINGS.USER_COLLECTION_NAME)
// export const feedBackCollection: Collection<FeedBackDBType> = db.collection<FeedBackDBType>(SETTINGS.FEEDBACK_COLLECTION_NAME)
//
// // проверка подключения к бд
// export const connectToDB = async () => {
//     try {
//         await client.connect()
//         console.log('connected to db')
//         return true
//     } catch (e) {
//         console.log(e)
//         await client.close()
//         return false
//     }
// }
import mongoose from 'mongoose'

const dbName = 'home_works'
const mongoURI = SETTINGS.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`

export async function runDb() {
    try {
        await mongoose.connect(mongoURI)
        console.log('it is ok connect to mongoose')
    } catch (e) {
        console.log('no connection')
        await mongoose.disconnect()
    }
}
export const db = {
    client: {} as MongoClient,

    getDbName(): Db {
        if (!this.client || !(this.client instanceof MongoClient)) {
            throw new Error("MongoClient is not initialized");
        }
        return this.client.db();
    },
    async run(url: string) {
        try {
            this.client = new MongoClient(url)
            await this.client.connect();
            await this.getDbName().command({ping: 1});
            console.log("Connected successfully to mongo server");
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
            await this.client.close();
        }

    },
    async stop() {
        await this.client.close();
        console.log("Connection successful closed");
    },
    async drop() {
        try {
            //await this.getDbName().dropDatabase()
            const collections = await this.getDbName().listCollections().toArray();

            for (const collection of collections) {
                const collectionName = collection.name;
                await this.getDbName().collection(collectionName).deleteMany({});
            }
        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },
    getCollections() {
        return {
            blogCollection: this.getDbName().collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME),
            postCollection: this.getDbName().collection<PostDBType>(SETTINGS.POST_COLLECTION_NAME),
            userCollection: this.getDbName().collection<UserDBType>(SETTINGS.USER_COLLECTION_NAME),
            feedBackCollection: this.getDbName().collection<FeedBackDBType>(SETTINGS.FEEDBACK_COLLECTION_NAME),
            expiredRefreshTokenCollection: this.getDbName().collection<ExpiredRefreshTokens>(SETTINGS.EXPIRED_REFRESH_TOKEN_NAME),
            usersSessionsCollection: this.getDbName().collection<SessionDBType>(SETTINGS.USERS_SESSIONS_NAME),
            rateLimitsCollection: this.getDbName().collection<rateLimits>(SETTINGS.RATE_LIMIT_NAME)

            //...all collections
        }
    },

}
// export const {
//     userCollection,
//     postCollection,
//     feedBackCollection,
//     blogCollection
// } = db.getCollections()


