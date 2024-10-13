import {Request, Response} from "express";
import {authService} from "../../domain/auth-service";
import {StatusCode} from "../../../comments/domain/comments-service";

export const setNewPassword =  async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword
    const recoveryCode = req.body.recoveryCode
    const result = await authService.setNewPassword(newPassword, recoveryCode)

    if (result.statusCode === StatusCode.NotFound || result.statusCode === StatusCode.Forbidden) {
        return res.status(400).json({ errorsMessages: [{ message: "recoveryCode", field: "recoveryCode" }] });
    }
    console.log(" current email is not registered")
    return res.sendStatus(204)
}