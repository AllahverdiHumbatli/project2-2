import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import {BlogDBType} from "../../types/DBtypes";


export const BlogSchema = new mongoose.Schema<BlogDBType>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})
export const BlogModel = mongoose.model<BlogDBType>('blogs', BlogSchema)