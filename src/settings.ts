import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 4001,
    PATH: {
        VIDEOS: '/videos',
    },
    MONGO_URL: process.env.MONGO_URL || '',
    SECRET_KEY: process.env.SECRET_KEY || '',
    DB_NAME: process.env.DB_NAME || '',
    BLOG_COLLECTION_NAME: 'blogCollection',
    POST_COLLECTION_NAME: 'postCollection',
    USER_COLLECTION_NAME: 'userCollection',
    FEEDBACK_COLLECTION_NAME: 'feedBackCollection',
    EXPIRED_REFRESH_TOKEN_NAME: 'expiredRefreshTokenCollection'

}