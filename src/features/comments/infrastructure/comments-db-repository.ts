
import {db} from "../../../common/db/mongo-db";
import {ObjectId, OptionalId} from "mongodb";
import {FeedBackDBType} from "../../../common/types/DBtypes";
import {CommentsModel} from "../../../common/db/mongoose/mongooseSchemas";


export const commentsDbRepository = {

    async postComment(commentEntity: FeedBackDBType){
        const res = await CommentsModel.insertMany([commentEntity]);
        return  res[0]._id.toString()
    },
    async uptadeCommentById(id: string, content: string){
     const uptadeComment = await CommentsModel.updateOne({_id: new ObjectId(id)}, {$set: {content: content}});
        if(uptadeComment.matchedCount === 1){
            return true
        }
        return false
    },
    async isOwner(userId: string) {
        const isOwner = await CommentsModel.findOne({"commentatorInfo.userId": userId})
        if(isOwner){
            return true
        }
        return false
    },
    async deleteCommentById(id: string){
        const result = await CommentsModel.deleteOne({_id: new ObjectId(id)})
        if(result.deletedCount === 1 ){ return true }
        return false
    }
}
