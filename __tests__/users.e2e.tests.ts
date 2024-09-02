import {initApp} from "../src/app";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/common/db/mongo-db";
import request from "supertest";
import {Express} from "express";
import {testingDtosCreator} from "./utils/createNewUser";


describe("users flow", ()=> {
let app: Express
    beforeAll(async () => {
        app = initApp()
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
       await db.drop()
    })
    afterAll(async () => {
        await db.drop()
        await db.stop()
    })

describe('/creating and deleting users flow', () => {
    let user
    let userViewModel
    user =  testingDtosCreator.createUserDto({login:"alik2", pass:"xcxv332", email:"al.humbatli@gmail.com"})
    it('should create new user', async()=> {
        let res = await request(app).
        post('/users').
        send(user).
        auth("admin", "qwerty").
        expect(201)

        userViewModel = res.body

    })
    it('should not create new user, because dont have authorization', async()=> {
        await request(app).
        post('/users').
        send(user).
        expect(401)
    })
    it('should not create new user, because login doesnt not unique', async()=> {
        await request(app).
        post('/users').
        send(user).
        auth("admin", "qwerty").
        expect(400)
    })
    it('should delete user by id', async()=> {
        await request(app).
        delete('/users/' + `${userViewModel!.id}`).
        auth("admin", "qwerty").
        expect(204)
    })
    it('should not delete user because of authorization', async()=> {
        await request(app).
        delete('/users/' + `${userViewModel!.id}`).
        expect(401)
    })
    it('should not delete user because user doesnt exist', async()=> {
        await request(app).
        delete('/users/' + `${userViewModel!.id}`).
        auth("admin", "qwerty").
        expect(404)
    })

})



})