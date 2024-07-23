import {blogCollection} from "../../db/mongo-db";
import {ObjectId, OptionalId} from "mongodb";
import {BlogDBType} from "../../types";


export const blogsQueryRepositories = {
    async getBlogs(query: any) {

        const search = query.searchNameTerm
            ? {name: {$regex: query.searchNameTerm, $options: 'i'}}
            : {}
        const filter = {
            // ...byId,
            // _id: {$in: [new ObjectId(someStringId), ...]}
            ...search,
        }
        console.log(filter)
        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await blogCollection
                .find(filter)
                .sort(query.sortBy, query.sortDirection) //сюда передаются строки
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray() as any[] /*SomePostType[]*/

            // подсчёт элементов (может быть вынесено во вспомогательный метод)
            const totalCount = await blogCollection.countDocuments(filter)

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

    },
    async getById(id: string){
        // return db.blogs.find(blog => blog.id === id)
        const res = await blogCollection.findOne({_id: new ObjectId(id)})
        console.log("res from getById " + res)
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