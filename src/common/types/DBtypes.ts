import {ObjectId} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";

export type BlogDBType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean

}
export type PostDBType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type UserDBType= {
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string,
    emailConfirmation: {    // доп поля необходимые для подтверждения
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

export type FeedBackDBType = {
    postID?: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}