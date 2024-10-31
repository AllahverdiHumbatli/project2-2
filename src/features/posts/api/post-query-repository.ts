import {db} from "../../../common/db/mongo-db";
import {ObjectId, OptionalId} from "mongodb";
import {PostsViewModel, PostViewModel, PostsQueryViewModel, PostsForBlogViewModel} from "./view-models/postsViewModels";
import {BlogsQueryViewModel} from "../../blogs/api/view-models/blogsViewModels";
import {PostModel} from "../../../common/db/mongoose/mongooseSchemas";

export class PostsQueryRepository {
    async getPosts(query: PostsQueryViewModel):Promise<PostsViewModel> {
        try {
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await PostModel
                .find({})
                .sort({ [query.sortBy]: sortDirection }) //при интеграции монгуса поменялся тут код учти
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean() /*SomePostType[]*/

            const totalCount = await PostModel.countDocuments({})
            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: items.map(post => ({
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt
                }))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }

    }
    async getPostById(id: string):Promise<PostViewModel> {
        const res = await PostModel.findOne({_id: new ObjectId(id)})
        console.log("рес из монго", res)
        if (res) {
            return {
                id: res._id.toString(), // Преобразование ObjectId в строку
                title: res.title,
                shortDescription: res.shortDescription,
                content: res.content,
                blogId: res.blogId,
                blogName: res.blogName,
                createdAt: res.createdAt
            }

        }
        return
    }
    async getAllPostsForOneBlog(query: PostsQueryViewModel, blogId: string):Promise<PostsForBlogViewModel> {

        const filter = {
            blogId,
            // _id: {$in: [new ObjectId(someStringId), ...]}

        }
        console.log(filter)
        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const items = await PostModel
                .find(filter)
                .sort({ [query.sortBy]: sortDirection }) //сюда передаются строки
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean() as any[] /*SomePostType[]*/

            // подсчёт элементов (может быть вынесено во вспомогательный метод)
            const totalCount = await PostModel.countDocuments(filter)

            // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: items.map(post => ({
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt
                }))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }
}
/////////////////////////////////////////////


// export const postQueryRepository = {
//     async getPosts(query: PostsQueryViewModel):Promise<PostsViewModel> {
//         try {
//             const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
//             // собственно запрос в бд (может быть вынесено во вспомогательный метод)
//             const items = await PostModel
//                 .find({})
//                 .sort({ [query.sortBy]: sortDirection }) //при интеграции монгуса поменялся тут код учти
//                 .skip((query.pageNumber - 1) * query.pageSize)
//                 .limit(query.pageSize)
//                 .lean() /*SomePostType[]*/
//
//             const totalCount = await PostModel.countDocuments({})
//             return {
//                 pagesCount: Math.ceil(totalCount / query.pageSize),
//                 page: query.pageNumber,
//                 pageSize: query.pageSize,
//                 totalCount: totalCount,
//                 items: items.map(post => ({
//                     id: post._id.toString(),
//                     title: post.title,
//                     shortDescription: post.shortDescription,
//                     content: post.content,
//                     blogId: post.blogId,
//                     blogName: post.blogName,
//                     createdAt: post.createdAt
//                 }))
//             }
//         } catch (e) {
//             console.log(e)
//             return {error: 'some error'}
//         }
//
//     },
//     async getPostById(id: string):Promise<PostViewModel> {
//         const res = await PostModel.findOne({_id: new ObjectId(id)})
//         console.log("рес из монго", res)
//         if (res) {
//             return {
//                 id: res._id.toString(), // Преобразование ObjectId в строку
//                 title: res.title,
//                 shortDescription: res.shortDescription,
//                 content: res.content,
//                 blogId: res.blogId,
//                 blogName: res.blogName,
//                 createdAt: res.createdAt
//             }
//
//         }
//         return
//     },
//     async getAllPostsForOneBlog(query: PostsQueryViewModel, blogId: string):Promise<PostsForBlogViewModel> {
//
//         const filter = {
//             blogId,
//             // _id: {$in: [new ObjectId(someStringId), ...]}
//
//         }
//         console.log(filter)
//         try {
//             // собственно запрос в бд (может быть вынесено во вспомогательный метод)
//             const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
//             const items = await PostModel
//                 .find(filter)
//                 .sort({ [query.sortBy]: sortDirection }) //сюда передаются строки
//                 .skip((query.pageNumber - 1) * query.pageSize)
//                 .limit(query.pageSize)
//                 .lean() as any[] /*SomePostType[]*/
//
//             // подсчёт элементов (может быть вынесено во вспомогательный метод)
//             const totalCount = await PostModel.countDocuments(filter)
//
//             // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
//             return {
//                 pagesCount: Math.ceil(totalCount / query.pageSize),
//                 page: query.pageNumber,
//                 pageSize: query.pageSize,
//                 totalCount: totalCount,
//                 items: items.map(post => ({
//                     id: post._id.toString(),
//                     title: post.title,
//                     shortDescription: post.shortDescription,
//                     content: post.content,
//                     blogId: post.blogId,
//                     blogName: post.blogName,
//                     createdAt: post.createdAt
//                 }))
//             }
//         } catch (e) {
//             console.log(e)
//             return {error: 'some error'}
//         }
//     }
// }
//
//
