import {Request, Response} from "express";
import {authService} from "../../domain/auth-service";
import {StatusCode} from "../../../comments/domain/comments-service";

export const passwordRecovery =  async (req: Request, res: Response) => {
    const email = req.body.email
    const result = await authService.sendEmailForRecoveryPassword(email)

    if (result.statusCode === StatusCode.noContent) {
        return res.sendStatus(204)
    }
    console.log(" current email is not registered")
    return res.sendStatus(204)
}