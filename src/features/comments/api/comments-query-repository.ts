import {ObjectId} from "mongodb";
import {CommentViewType} from "./view-models/commentViewType";
import {Result, StatusCode} from "../domain/comments-service";
import {CommentsQueryViewModel} from "../view-models/commentsViewModels";
import {CommentsModel, LikesForCommentsModel} from "../../../common/db/mongoose/mongooseSchemas";

export class CommentsQueryRepository{
    async getCommentById(commentId: string, userId?: string):Promise<Result<CommentViewType>> {
        const currentUserLike  = await LikesForCommentsModel.findOne({commentId,userId })
        const res = await CommentsModel.findOne({_id: new ObjectId(commentId)})
        if(res){
            return {
                data: {  id: res._id.toString(),
                    content: res.content,
                    commentatorInfo: {
                        userId: res.commentatorInfo.userId,
                        userLogin: res.commentatorInfo.userLogin,
                    },
                    createdAt: res.createdAt,
                    likesInfo: {
                    likesCount: res.likesInfo.likesCount,
                    dislikesCount: res.likesInfo.dislikesCount,
                    myStatus: currentUserLike?.status ?? 'None'
                    }
                },
                statusCode: StatusCode.Success,
            }
        }
        return {
            data: null,
            statusCode: StatusCode.NotFound
        }


    }
    async getCommentsForPost(sanitizedQuery: CommentsQueryViewModel, postId: string, userId: string | null) {
        try {
            const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1;
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const comments  = await CommentsModel
                .find({postID: postId})
                .sort({ [sanitizedQuery.sortBy]: sortDirection }) //сюда передаются строки
                .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                .limit(sanitizedQuery.pageSize)
                .lean() /*SomePostType[]*/
            const commentsWithStatuses =  await Promise.all(
                comments.map(async (comment) => {
                    const likeStatus: string = userId
                        ? ( await LikesForCommentsModel.findOne({userId, commentId: comment._id.toString()}))?.status ?? "None"
                        : "None";

                    return ({
                        id: comment._id.toString(),
                        content: comment.content,
                        commentatorInfo: {
                            userId: comment.commentatorInfo.userId,
                            userLogin: comment.commentatorInfo.userLogin,
                        },
                        createdAt: comment.createdAt,
                        likesInfo: {
                            likesCount: comment.likesInfo.likesCount,
                            dislikesCount:comment.likesInfo.dislikesCount,
                            myStatus: likeStatus

                        }
                    })
                })
            )

            const totalCount = await CommentsModel.countDocuments({postID: postId})


            const result = {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount: totalCount,
                items: commentsWithStatuses.map(comment => ({
                    id: comment.id.toString(),
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    },
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: comment.likesInfo.likesCount,
                        dislikesCount: comment.likesInfo.dislikesCount,
                        myStatus: comment.likesInfo.myStatus
                    }
                }))
            }

            return result
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }


    }

}
///////////////////////////////////////////////////////////////////////////
// export const commentsQueryRepositories = {
//     async getCommentById(id: string):Promise<Result<CommentViewType>> {
//             const res = await CommentsModel.findOne({_id: new ObjectId(id)})
//             if(res){
//                 return {
//                     data: {  id: res._id.toString(),
//                         content: res.content,
//                         commentatorInfo: {
//                             userId: res.commentatorInfo.userId,
//                             userLogin: res.commentatorInfo.userLogin,
//                         },
//                         createdAt: res.createdAt
//                 },
//                     statusCode: StatusCode.Success,
//                 }
//             }
//                 return {
//                     data: null,
//                     statusCode: StatusCode.NotFound
//                 }
//
//
//     },
//     async getCommentsForPost(sanitizedQuery: CommentsQueryViewModel, postId: string) {
//             try {
//                 const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1;
//                 // собственно запрос в бд (может быть вынесено во вспомогательный метод)
//                 const items  = await CommentsModel
//                     .find({postID: postId})
//                     .sort({ [sanitizedQuery.sortBy]: sortDirection }) //сюда передаются строки
//                     .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
//                     .limit(sanitizedQuery.pageSize)
//                     .lean() as any[] /*SomePostType[]*/
//
//                 const totalCount = await CommentsModel.countDocuments({postID: postId})
//
//                 return {
//                     pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
//                     page: sanitizedQuery.pageNumber,
//                     pageSize: sanitizedQuery.pageSize,
//                     totalCount: totalCount,
//                     items: items.map(comment => ({
//                         id: comment._id.toString(),
//                         content: comment.content,
//                         commentatorInfo: {
//                             userId: comment.commentatorInfo.userId,
//                             userLogin: comment.commentatorInfo.userLogin,
//                         },
//                         createdAt: comment.createdAt
//                     }))
//                 }
//             } catch (e) {
//                 console.log(e)
//                 return {error: 'some error'}
//             }
//
//
//     }
//
// }