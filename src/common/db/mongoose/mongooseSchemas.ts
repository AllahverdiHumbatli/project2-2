import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import {
    BlogDBType,
    CommentatorInfoType,
    EmailConfirmation,
    FeedBackDBType, PasswordRecovery,
    PostDBType, SessionDBType,
    UserDBType
} from "../../types/DBtypes";


export const BlogSchema = new mongoose.Schema<BlogDBType>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})
export const BlogModel = mongoose.model<BlogDBType>('blogs', BlogSchema)

export const PostSchema = new mongoose.Schema<PostDBType>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true },
})
export const PostModel = mongoose.model<PostDBType>('posts', PostSchema)
// FeedBackDBType
export const CommentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>({
    userId: { type: String, require: true },
    userLogin: { type: String, require: true }
})
export const CommentsSchema = new mongoose.Schema<FeedBackDBType>({
    postID: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: { type: CommentatorInfoSchema, require: true },
    createdAt: { type: String, require: true }
})
export const CommentsModel = mongoose.model<FeedBackDBType>('comments', CommentsSchema)

export const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmation>({
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true },


})
export const passwordRecoverySchema = new mongoose.Schema<PasswordRecovery>({
    passwordRecoveryCode: { type: String, require: true, default: null },
    expirationDate: { type: Date, require: true, default: null },
})
export const UserSchema = new mongoose.Schema<UserDBType>({
    login: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    passwordHash: { type: String, require: true },
    passwordRecovery: { type: passwordRecoverySchema, require: true, default: null },
    emailConfirmation: { type: EmailConfirmationSchema, require: true },
})

export const UsersModel = mongoose.model<UserDBType>('users', UserSchema)

export const UserSessionsSchema = new mongoose.Schema<SessionDBType>({
    user_id: { type: String, require: true },
    device_id: { type: String, require: true },
    iat: { type: Number, require: true },
    device_name: { type: String, require: true },
    ip: { type: String, require: true },
    exp: {type: Number, require: true}
})

export const UsersSessionsModel = mongoose.model<SessionDBType>('sessions', UserSessionsSchema)

