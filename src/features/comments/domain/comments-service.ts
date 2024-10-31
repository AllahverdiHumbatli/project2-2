
import {CommentsDbRepository, commentsDbRepository} from "../infrastructure/comments-db-repository";

import {db} from "../../../common/db/mongo-db";
import {FeedBackDBType} from "../../../common/types/DBtypes";
import {CommentViewType} from "../api/view-models/commentViewType";
import {CommentsQueryRepository} from "../api/comments-query-repository";
import {LikeCountCalculator} from "./like-count-calculator";
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
export class CommentsService {
    commentsDbRepository: CommentsDbRepository;
    constructor() {
        this.commentsDbRepository = new CommentsDbRepository();
    }

    async createComment(commentText: string, userId: string, userLogin: string, postID: string):Promise<string> {
        const commentEntity: FeedBackDBType = {
            postID: postID,
            content: commentText,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        }
        return await this.commentsDbRepository.postComment(commentEntity);
    }
    async putLikeStatusForComment(likeDto: {
        userId: string,
        commentId: string,
        status: string
    }):Promise<void> {

              const likeStatus = await this.commentsDbRepository.isLikeExist(likeDto.userId, likeDto.commentId)
                     if(likeStatus){
                         if(likeStatus === likeDto.status ){
                             return
                         }

                         await this.commentsDbRepository.updateExistingLike(likeDto)

                         const currentComment = await this.commentsDbRepository.getCommentById(likeDto.commentId)
                         const result = new LikeCountCalculator().calculateExsistingIncriment(
                             likeDto.status,
                             currentComment!.likesInfo.likesCount,
                             currentComment!.likesInfo.dislikesCount
                         )

                         await this.commentsDbRepository.putNewCountForExistingCommentsLikes(likeDto.commentId, result)

                         return
                     }

                     await this.commentsDbRepository.createLike(likeDto)

                     const result = new LikeCountCalculator().calculateNew(
                        likeDto.status
                    )

                     await this.commentsDbRepository.putNewCountForExistingCommentsLikes(likeDto.commentId, result)


    }

    async uptadeCommentById(userId: string, commentId: string, content: string): Promise<Result<void>> {

        const isOwner = await this.isCommentOwner(userId)
        if (isOwner.statusCode === StatusCode.Forbidden) {
            return {
                statusCode: StatusCode.Forbidden,
                data: null
            }
        }
        await this.commentsDbRepository.uptadeCommentById(commentId, content)
        return {
            statusCode: StatusCode.Success,
            data: null
        }
    }
    async deleteCommentById(userId: string, commentId: string) {
        const isOwner = await this.isCommentOwner(userId)
        if (isOwner.statusCode === StatusCode.Forbidden) {
            return {
                statusCode: StatusCode.Forbidden,
                data: null
            }
        }
        await this.commentsDbRepository.deleteCommentById(commentId)
        return {
            statusCode: StatusCode.Success,
            data: null
        }
    }
    async isCommentOwner(userId: string) {
        const isCommentOwner: boolean = await this.commentsDbRepository.isOwner(userId)
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
////////////////////////////////////////////////
// export const commentsService  = {
//     async createComment(commentText: string, userId: string, userLogin: string, postID: string):Promise<string> {
//         const commentEntity: FeedBackDBType = {
//             postID: postID,
//             content: commentText,
//             commentatorInfo: {
//                 userId: userId,
//                 userLogin: userLogin
//             },
//             createdAt: new Date().toISOString()
//         }
//         return await commentsDbRepository.postComment(commentEntity);
//     },
//     async uptadeCommentById(userId: string, commentId: string, content: string): Promise<Result<void>> {
//
//         const isOwner = await this.isCommentOwner(userId)
//         if (isOwner.statusCode === StatusCode.Forbidden) {
//             return {
//                 statusCode: StatusCode.Forbidden,
//                 data: null
//             }
//         }
//         await commentsDbRepository.uptadeCommentById(commentId, content)
//         return {
//             statusCode: StatusCode.Success,
//             data: null
//         }
//     },
//     async deleteCommentById(userId: string, commentId: string) {
//         const isOwner = await this.isCommentOwner(userId)
//         if (isOwner.statusCode === StatusCode.Forbidden) {
//             return {
//                 statusCode: StatusCode.Forbidden,
//                 data: null
//             }
//         }
//          await commentsDbRepository.deleteCommentById(commentId)
//         return {
//             statusCode: StatusCode.Success,
//             data: null
//         }
//     },
//     async isCommentOwner(userId: string) {
//         const isCommentOwner: boolean = await commentsDbRepository.isOwner(userId)
//         if (!isCommentOwner) {
//             return {
//                 statusCode: StatusCode.Forbidden,
//                 data: null
//             }
//         }
//         return {
//             statusCode: StatusCode.Allowed,
//             data: null
//         }
//     }
// }