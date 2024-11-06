import request from 'supertest';
import {Express} from "express";
import {initApp} from "../../src/app";
import {runDb} from "../../src/common/db/mongo-db";

export async function getNewCommentsId(token: string, postId: string, commentsNumber: number) {
    let app: Express
    let commentsId: any = {}
    app = initApp()
    await runDb()

    for(let i = 0; i < commentsNumber; i++){
        const contentForComment = {content: "alikalikalikalikalikalikalikalikalikalikalikalikalikalik"}
        const res = await request(app)
            .post(`/posts/${postId}/comments`)
            .auth(token, { type: 'bearer' })
            .send(contentForComment)
            .expect(201)
        // usersJwtToken[`user${i+1}`] = res.body.accessToken
        commentsId[`commentID${i+1}`] = res.body.id
    }


    return commentsId
}