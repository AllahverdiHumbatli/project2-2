import {Express} from "express";
import {initApp} from "../../src/app";
import {runDb} from "../../src/common/db/mongo-db";
import request from "supertest";

export async function getPostId(){
    let app: Express
    let blogId: string
    let postId: any = {}
    app = initApp()
    await runDb()

    const newBlogForCreate = {
        name: 'alik',
        description: 'alik',
        websiteUrl: 'https://chatgpt.com/'
    }

    const res =  await request(app).post('/blogs').auth("admin", "qwerty").send(newBlogForCreate).expect(201)
    blogId = res.body.id

    const newPostEntity =
        {
            title: "stridsfng",
            shortDescription: "stsding",
            content: "strinhjhnjg",
            blogId: blogId!
        }

    const res2 = await request(app).post('/posts').auth("admin", "qwerty").send(newPostEntity).expect(201)
    postId = res2.body.id

    return postId

}