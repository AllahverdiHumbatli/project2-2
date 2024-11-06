import {ObjectId} from "mongodb";
import {BlogsQueryViewModel, BlogsViewModel, BlogViewModel} from "./view-models/blogsViewModels";
import {BlogModel} from "../../../common/db/mongoose/mongooseSchemas";


export class BlogsQueryRepositories {
    async getBlogs(query: BlogsQueryViewModel): Promise<BlogsViewModel> {

        const search = query.searchNameTerm
            ? {name: {$regex: query.searchNameTerm, $options: 'i'}}
            : {}
        const filter = {
            // ...byId,
            // _id: {$in: [new ObjectId(someStringId), ...]}
            ...search,
        }
        try {    // db.
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const items = await BlogModel
                .find(filter)
                .sort({ [query.sortBy]: sortDirection }) //при интеграции монгуса поменялся тут код учти
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean()/*SomePostType[]*/

            // подсчёт элементов (может быть вынесено во вспомогательный метод)
            const totalCount = await BlogModel.countDocuments(filter)

            // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: items.map(blog => ({
                    id: blog._id.toString(),
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership
                }))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }


        //

    }
    async getById(id: string) :Promise <BlogViewModel>{
        // return db.blogs.find(blog => blog.id === id)
        const res = await BlogModel.findOne({_id: new ObjectId(id)})
        if(res){
            return {
                id: res._id.toString(),
                name: res.name,
                description: res.description,
                websiteUrl: res.websiteUrl,
                createdAt: res.createdAt,
                isMembership: res.isMembership
            }

        }
        return false


    }
}
// export const blogsQueryRepositories = new BlogsQueryRepositories()
