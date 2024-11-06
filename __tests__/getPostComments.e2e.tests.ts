import request from 'supertest';
import {initApp} from "../src/app";
import {Express} from "express";
import {runDb} from "../src/common/db/mongoose/mongooseDb";
import {getUsersTokens} from "./utils/getNewUsersTokens";
import {getNewCommentsId} from "./utils/getNewCommentsId";
import {getPostId} from "./utils/getNewPostId";
import {setLikeDislikeNone} from "./utils/setLikeDislikeNone";
import {getCommentWithId} from "./utils/getCommentWithId";


let app: Express
let postId : string
let usersJwtToken : any= {}
let commentsId: any = {}

describe('/get post comments with likeStatuses', () => {
    jest.setTimeout(30000);
    beforeAll(async () => {
        app = initApp()
        await runDb()
        await request(app).delete('/testing/all-data').expect(204)
        postId  = await getPostId()
        usersJwtToken =  await getUsersTokens(4)
        commentsId = await getNewCommentsId(usersJwtToken.user1, postId, 6)
        console.log("usersJwtToken", usersJwtToken)
        console.log('commentsId', commentsId)
    })
    // like comment 1 by user 1, user 2;

    // dislike comment 3 by user 1;

    it("should like comment1  by user1", async()=>{
        await setLikeDislikeNone(usersJwtToken.user1, commentsId.commentID1, "Like" )
    })
    it("should like comment1  by user2", async()=>{
        await setLikeDislikeNone(usersJwtToken.user2, commentsId.commentID1, "Like" )
    })
    it("GET comment1 by id with 2 like 0 dislike", async() => {
        const res = await getCommentWithId(commentsId.commentID1)
        console.log(res.body)
    })
    // like comment 2 by user 2, user 3;
    it("should like comment2  by user1", async()=>{
        await setLikeDislikeNone(usersJwtToken.user2, commentsId.commentID2, "Like" )
    })
    it("should like comment2  by user2", async()=>{
        await setLikeDislikeNone(usersJwtToken.user3, commentsId.commentID2, "Like" )
    })
    it("GET comment2 by id with 2 like 0 dislike", async() => {
        const res = await getCommentWithId(commentsId.commentID2)
        console.log(res.body)
    })
    it("should get all comments for post", async() => {
        const res = await request(app)
            .get(`/posts/${postId}/comments`)
            .expect(200)
        console.log(res.body.items.filter((comment:any) => comment.id === commentsId.commentID2))
    })

    //create 4 user by admin and put their login and password in some array
    // login these users and push their jwt tokens into some array
    //create 6 comments and like them by these users with bearer token in req.headers
    // Get the comments by user 1 after all likes
})
