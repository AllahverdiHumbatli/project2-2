import {Request, Response} from "express";
import {authService} from "../../domain/auth-service";
import {StatusCode} from "../../../comments/domain/comments-service";

// export const emailResending =  async (req: Request, res: Response) => {
//     const email = req.body.email
//     const user = await db.getCollections().userCollection.findOne({"email": email});
//     if(user){
//         const userId = user._id.toString()
//         const isConfirmed = await confirmationFlagCheck.isConfirmed(userId)
//         if(isConfirmed){
//              return res.status(400).send({ errorsMessages: [{ message: "email is already confirmed", field: "email" } ] });
//         }
//         await authService.sendEmail(user.email, user.emailConfirmation.confirmationCode);
//         return res.sendStatus(204)
//     }
//     return  res.status(400).send({ errorsMessages: [{ message: "email is already confirmed", field: "email" } ] });
// }

export const emailResending =  async (req: Request, res: Response) => {
    const email = req.body.email
    const result = await authService.emailResending(email)
    if (result.statusCode === StatusCode.userAlreadyConfirmed) {
        return res.status(400).send(result.data)
    }
    if (result.statusCode === StatusCode.noContent) {
        return res.sendStatus(204)
    }

        return res.status(400).send(result.data)

}