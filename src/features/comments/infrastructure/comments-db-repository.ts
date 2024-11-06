import {ObjectId} from "mongodb";
import {FeedBackDBType} from "../../../common/types/DBtypes";
import {CommentsModel, LikesForCommentsModel} from "../../../common/db/mongoose/mongooseSchemas";

export class CommentsDbRepository {
    async postComment(commentEntity: FeedBackDBType){
        const res = await CommentsModel.insertMany([commentEntity]);
        return  res[0]._id.toString()
    }
    async uptadeCommentById(id: string, content: string){
        const uptadeComment = await CommentsModel.updateOne({_id: new ObjectId(id)}, {$set: {content: content}});
        if(uptadeComment.matchedCount === 1){
            return true
        }
        return false
    }
    async isOwner(userId: string) {
        const isOwner = await CommentsModel.findOne({"commentatorInfo.userId": userId})
        if(isOwner){
            return true
        }
        return false
    }
    async deleteCommentById(id: string){
        const result = await CommentsModel.deleteOne({_id: new ObjectId(id)})
        if(result.deletedCount === 1 ){ return true }
        return false
    }
    async isLikeExist(userId: string, commentId: string):Promise<string|null|undefined>{
        const res = await LikesForCommentsModel.findOne({ userId, commentId })
        if(res){
            return res!.status
        }
        return null
    }
    async updateExistingLike(likeDto: {
        userId: string,
        commentId: string,
        status: string
    } ):Promise<void>{
        await LikesForCommentsModel.updateOne(
            { userId: likeDto.userId, commentId: likeDto.commentId },
            { $set: { status: likeDto.status } })
    }
    async putNewCountForExistingCommentsLikes(commentId: string,likeOrDislike: {
        likesCount: number,
        dislikesCount: number
    } ){
        await CommentsModel.updateMany(
            {_id: new ObjectId(commentId)},
        { $inc: { "likesInfo.likesCount": likeOrDislike.likesCount, "likesInfo.dislikesCount": likeOrDislike.dislikesCount } }
        )
    }
    async createLike(likeDto: {
        status: string
        userId: string,
        commentId: string,
    } ):Promise<void>{
            await LikesForCommentsModel.insertMany([likeDto]);
    }
    async getCommentById(commentId: string, userId?: string) {
    const res = await CommentsModel.findOne({_id: new ObjectId(commentId)})
        return res
}
    async getCurrentUserLikeStatus(userId: string, commentId: string) {
        console.log(userId, commentId)
        const likeEntity = await LikesForCommentsModel.findOne({commentId,userId })
        console.log('likeEntity', likeEntity)
        return likeEntity ? likeEntity.status : 'None';
    }
    async deleteAllData(){
        return await CommentsModel.deleteMany({})
    }
}

/////////////////////////////////////////////////
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
