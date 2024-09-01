import {postRepositories} from "../infrastructure/post-db-repository";
import {blogsRepositories} from "../../blogs/infrastructure/blogs-db-repository";
import {blogsQueryRepositories, } from "../../blogs/api/blogs-query-repository";
import {PostViewModel} from "../api/view-models/postsViewModels";

// type Pagination = { pageNumber: number; pageSize: number; sortBy: string; sortDirection: string; }
// type ParPagination = Partial<Pagination>
// type I = Required<ParPagination>
// type a = {a : string}
// type b = {b : number}
// type c = a & b


export const postsService = {

    // todo generics =  dynamic typization
    async postPOST(title: string, shortDescription: string, content: string, blogId: string):Promise<string> {
        const newPost = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
        }
        return await postRepositories.postPOST(newPost)
    }
    ,
    //to do use query-repo for return the new created post
    async postPOSTByBlogId(title: string, shortDescription: string, content: string, blogId: string):Promise<string|false> {
        const isBlogExists = await blogsQueryRepositories.getById(blogId)
        if(isBlogExists){
            const newPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: Math.random().toString(36).substring(2, 9),
                createdAt: new Date().toISOString(),
            }
            return await postRepositories.postPOST(newPost)
        }
        return false

    },
    async uptadePostById(id: string, title: string, shortDescription: string, content: string, blogId: string):Promise<boolean> {
       return postRepositories.uptadePostById(id, title, shortDescription, content, blogId)
    },
    async deletePostById(id: string):Promise<boolean> {
        return postRepositories.deletePostById(id)
    },
}

