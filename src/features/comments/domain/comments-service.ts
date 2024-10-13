
import {commentsDbRepository} from "../infrastructure/comments-db-repository";
import {commentsQueryRepositories} from "../api/comments-query-repository";
import {db} from "../../../common/db/mongo-db";
import {FeedBackDBType} from "../../../common/types/DBtypes";
import {CommentViewType} from "../api/view-models/commentViewType";
export enum StatusCode {
    Success = 0,
    NotFound = 1,
    Forbidden = 2,
    Allowed = 3,
    emailNotSent = 4,
    userAlreadyConfirmed = 5,
    noContent = 6,
    emailNotExist=7,

}
export type Result<T> = {
    data: T | null,
    statusCode: StatusCode
}

export const commentsService  = {
    async createComment(commentText: string, userId: string, userLogin: string, postID: string):Promise<string> {
        const commentEntity: FeedBackDBType = {
            postID: postID,
            content: commentText,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt: new Date().toISOString()
        }
        return await commentsDbRepository.postComment(commentEntity);
    },
    async uptadeCommentById(userId: string, commentId: string, content: string): Promise<Result<void>> {

        const isOwner = await this.isCommentOwner(userId)
        if (isOwner.statusCode === StatusCode.Forbidden) {
            return {
                statusCode: StatusCode.Forbidden,
                data: null
            }
        }
        await commentsDbRepository.uptadeCommentById(commentId, content)
        return {
            statusCode: StatusCode.Success,
            data: null
        }
    },
    async deleteCommentById(userId: string, commentId: string) {
        const isOwner = await this.isCommentOwner(userId)
        if (isOwner.statusCode === StatusCode.Forbidden) {
            return {
                statusCode: StatusCode.Forbidden,
                data: null
            }
        }
         await commentsDbRepository.deleteCommentById(commentId)
        return {
            statusCode: StatusCode.Success,
            data: null
        }
    },
    async isCommentOwner(userId: string) {
        const isCommentOwner: boolean = await commentsDbRepository.isOwner(userId)
        if (!isCommentOwner) {
            return {
                statusCode: StatusCode.Forbidden,
                data: null
            }
        }
        return {
            statusCode: StatusCode.Allowed,
            data: null
        }
    }
}