import {BlogsDbRepository, } from "../infrastructure/blogs-db-repository";


export class BlogsService {

    constructor(protected blogsRepository: BlogsDbRepository) {

    }
    async postBlog(name: string, description: string, websiteUrl: string):Promise<string> {

        const newBlog = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await this.blogsRepository.postBlog(newBlog)

    }

    async updateById(id: string, name: string, description: string, websiteUrl: string):Promise<boolean> {
        return await this.blogsRepository.updateById(id, name, description, websiteUrl)
    }
    async deleteById(id: string):Promise<boolean> {
        return await this.blogsRepository.deleteById(id)
    }
}
// export const  blogsService = new BlogsService()