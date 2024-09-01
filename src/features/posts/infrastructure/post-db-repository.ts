
import {ObjectId, OptionalId} from "mongodb";
import {PostDBType} from "../../../common/types/DBtypes";
import {db} from "../../../common/db/mongo-db";



export const postRepositories = {

    async postPOST(newPost: PostDBType):Promise<string> {

        const res = await db.getCollections().postCollection.insertOne(newPost)

        return res.insertedId.toString()

    },
    async uptadePostById(id: string, title: string, shortDescription: string, content: string, blogId: string):Promise<boolean> {
        const result = await db.getCollections().postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })

        if (result.matchedCount === 1) {
            return true
        }
        return false

    },
    async deletePostById(id: string):Promise<boolean> {
        const result = await db.getCollections().postCollection.deleteOne({_id: new ObjectId(id)})
        if (result.deletedCount === 1) {
            return true
        }
        return false
    }



}


