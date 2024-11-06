import request from 'supertest';
import {Express} from "express";
import {initApp} from "../../src/app";
import {runDb} from "../../src/common/db/mongo-db";

export async function getUsersTokens(usersNumber: number) {
    let app: Express
    let usersCredentials: {
        login: string,
        password: string,
        email: string
    }[] = []
    let usersJwtToken : any= {}
    app = initApp()
    await runDb()

        for(let i = 0; i < usersNumber; i++)
        {
            const userCredential= {
                login:  `${i}user` ,
                password: "string",
                email: `${i}useremail@gmail.com`
            }
            usersCredentials.push(userCredential)
            await request(app).post('/users').auth("admin", "qwerty").send(userCredential).expect(201)
        }
        for(let i = 0; i < usersCredentials.length; i++){

            const dataForLogin = {
                loginOrEmail: usersCredentials[i].login ,
                password: usersCredentials[i].password
            }

            try{
                const res=   await request(app).post('/auth/login').send(dataForLogin).expect(200)

                usersJwtToken[`user${i+1}`] = res.body.accessToken
            } catch (error) {
                console.error("Login error:", error);
            }
        }



    return usersJwtToken
}