import {blogsRepositories} from "../infrastructure/blogs-db-repository";



export const blogsService = {
    async postBlog(name: string, description: string, websiteUrl: string):Promise<string> {

        const newBlog = {
             name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepositories.postBlog(newBlog)

    },

    async updateById(id: string, name: string, description: string, websiteUrl: string):Promise<boolean> {
        return await blogsRepositories.updateById(id, name, description, websiteUrl)
    },
    async deleteById(id: string):Promise<boolean> {
        return await blogsRepositories.deleteById(id)
    }
}