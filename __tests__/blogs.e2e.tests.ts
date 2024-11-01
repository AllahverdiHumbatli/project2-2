import  request from 'supertest';
import {db} from "../src/common/db/mongo-db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {initApp} from "../src/app";
import express, {Express} from "express";
import {SETTINGS} from "../src/settings";
import {runDb} from "../src/common/db/mongoose/mongooseDb";

let app: Express
let blog

describe('/videos', () => {
    beforeAll(async () => {
        //jest.setTimeout(200000);
        app = initApp()
        //const app = express()
        // console.log('app', app)
        app.set('trust proxy', true);
        // await db.run(SETTINGS.MONGO_URL)
        await runDb()

        console.log(1)
         await request(app).delete('/testing/all-data')
        console.log(2)
        })

    // afterAll(async () => {
    //     await db.drop()
    //     await db.stop()
    // })
    const newBlogForCreate = {
        name: 'alik',
        description: 'alik',
        websiteUrl: 'https://chatgpt.com/'
    }
    const newBlogForUptade = {
        name: 'alik Sasha',
        description: 'alik Sasha',
        websiteUrl: 'https://chatgpt.com/'
    }
    it('GET blogs = []', async () => {
        await request(app).get('/blogs').expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })
    it('does not create new blog', async () => {
        await request(app).post('/blogs').auth("admin", "qwerty")
            .send({
                name: "",
                description: "string",
                websiteUrl: "https://chatgpt.com/"
            }).expect(400, {
                "errorsMessages": [
                    {
                        "message": 'more then 15 or 0',
                        "field": "name"
                    }
                ]
            })
    })
    it('should create blog', async () => {
       const res =  await request(app).post('/blogs').auth("admin", "qwerty")
            .send(newBlogForCreate).expect(201)
        blog = res.body
    })
    it('Get blog with incorrect ID', async () => {
        await request(app).get('/blogs/' + '5f6a1c5b523d52002a9b98c7')
            .expect(404)
    })
    it('Get blog with сorrect ID', async () => {
        await request(app).get('/blogs/' + `${blog!.id}`)
            .expect(200, blog!)
    })
    it('Uptade blog with correct id ', async() =>{
        const res = await request(app).put('/blogs/' + `${blog!.id}`)
            .send(newBlogForUptade).auth("admin", "qwerty").expect(204)
    })
    it("delete blog with correct Id", async ()=>{
        await request(app).delete('/blogs/' + `${blog!.id}`).auth("admin", "qwerty").expect(204)
    })
    it("delete blog with no exists Id", async ()=>{
       await request(app).delete('/blogs/' + `${blog!.id}`).auth("admin", "qwerty").expect(404)
    })
    
})

