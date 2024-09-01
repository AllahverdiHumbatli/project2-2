import {Request, Response} from "express";
import {authService} from "../../domain/auth-service";

export const confirmationRegistration =  async (req: Request, res: Response) => {
    const  code  = req.body.code
        const isUserConfirmedEmail:boolean = await authService.confirmUser(code)
        if(isUserConfirmedEmail === false){
          return res.status(400).send({ errorsMessages: [{ message: "code error", field: "code" } ] });
        }
        return res.sendStatus(204)

}