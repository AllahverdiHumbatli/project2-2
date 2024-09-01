
import {db} from "../../../common/db/mongo-db";
import {ObjectId, OptionalId} from "mongodb";
import {FeedBackDBType} from "../../../common/types/DBtypes";


export const commentsDbRepository = {

    async postComment(commentEntity: FeedBackDBType){
        const res = await db.getCollections().feedBackCollection.insertOne(commentEntity);
        return  res.insertedId.toString()
    },
    async uptadeCommentById(id: string, content: string){
     const uptadeComment = await db.getCollections().feedBackCollection.updateOne({_id: new ObjectId(id)}, {$set: {content: content}});
        if(uptadeComment.matchedCount === 1){
            return true
        }
        return false
    },
    async isOwner(userId: string) {
        const isOwner = await db.getCollections().feedBackCollection.findOne({"commentatorInfo.userId": userId})
        if(isOwner){
            return true
        }
        return false
    },
    async deleteCommentById(id: string){
        const result = await db.getCollections().feedBackCollection.deleteOne({_id: new ObjectId(id)})
        if(result.deletedCount === 1 ){ return true }
        return false
    }
}
