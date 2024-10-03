import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import {BlogDBType, CommentatorInfoType, FeedBackDBType, PostDBType} from "../../types/DBtypes";


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
