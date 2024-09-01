import {db} from "../../../common/db/mongo-db";
import {ObjectId, OptionalId} from "mongodb";
import {CommentViewType} from "./view-models/commentViewType";
import {Result} from "../domain/comments-service";
import {StatusCode} from "../domain/comments-service";
import {CommentsQueryViewModel} from "../view-models/commentsViewModels";
export const commentsQueryRepositories = {
    async getCommentById(id: string):Promise<Result<CommentViewType>> {
            const res = await db.getCollections().feedBackCollection.findOne({_id: new ObjectId(id)})
            if(res){
                return {
                    data: {  id: res._id.toString(),
                        content: res.content,
                        commentatorInfo: {
                            userId: res.commentatorInfo.userId,
                            userLogin: res.commentatorInfo.userLogin,
                        },
                        createdAt: res.createdAt
                },
                    statusCode: StatusCode.Success,
                }
            }
                return {
                    data: null,
                    statusCode: StatusCode.NotFound
                }


    },
    async getCommentsForPost(sanitizedQuery: CommentsQueryViewModel, postId: string) {
            try {
                // собственно запрос в бд (может быть вынесено во вспомогательный метод)
                const items  = await db.getCollections().feedBackCollection
                    .find({postID: postId})
                    .sort(sanitizedQuery.sortBy, sanitizedQuery.sortDirection) //сюда передаются строки
                    .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                    .limit(sanitizedQuery.pageSize)
                    .toArray() as any[] /*SomePostType[]*/

                const totalCount = await db.getCollections().feedBackCollection.countDocuments({postID: postId})

                return {
                    pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                    page: sanitizedQuery.pageNumber,
                    pageSize: sanitizedQuery.pageSize,
                    totalCount: totalCount,
                    items: items.map(comment => ({
                        id: comment._id.toString(),
                        content: comment.content,
                        commentatorInfo: {
                            userId: comment.commentatorInfo.userId,
                            userLogin: comment.commentatorInfo.userLogin,
                        },
                        createdAt: comment.createdAt
                    }))
                }
            } catch (e) {
                console.log(e)
                return {error: 'some error'}
            }


    }

}