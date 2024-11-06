
import request from "supertest";
import {Express} from "express";
import {initApp} from "../../src/app";
import {runDb} from "../../src/common/db/mongo-db";
export async function setLikeDislikeNone(userToken: string, commentId: string,likeStatus: 'Like'|'Dislike'|'None') {
    let app: Express
    app = initApp()
    await runDb()

    const res = await request(app)
        .put(`/comments/${commentId}/like-status`)
        .auth(userToken, { type: 'bearer' })
        .send({
            "likeStatus": likeStatus
        })
        .expect(204)
}