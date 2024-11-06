import {Express} from "express";
import {initApp} from "../../src/app";
import {runDb} from "../../src/common/db/mongo-db";
import request from "supertest";

export async function  getCommentWithId(commentId: string) {
    let app: Express
    app = initApp()
    await runDb()
   return  request(app)
        .get(`/comments/${commentId}`)
        .expect(200)

}