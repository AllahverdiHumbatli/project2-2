import {Request, Response} from "express";
import {authService} from "../../domain/auth-service";

export const registrationUser =  async (req: Request, res: Response) => {
    let isConfirmed = false
    const newUserId = await authService.registerUser(req.body.login, req.body.password, req.body.email, isConfirmed)
    if(Array.isArray(newUserId)){
        res.status(400).send({ errorsMessages: [ newUserId[0] ] })
        return
    }
    res.sendStatus(204)
    return
    // const newUserData = authService.createUserWithoutAuth(req.body.login, req.body.email, req.body.password,)
}

//ссылайся на сначала на authService потом  userService для создания юзера и в ендпоинте регистрации и в эндпоинте создания юзера суперадмином
// лишние данные не поменшают пока что
//передавая соответственно IsConfirmed true и false в контроллере и в соответсвие с этим менять значаение этого поля в user service