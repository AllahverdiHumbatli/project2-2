import {Request, Response} from "express";
import {authService} from "../../domain/auth-service";
import {db} from "../../../../common/db/mongo-db";
import {confirmationFlagCheck} from "../../managers/confirmationFlagCheck";
import {randomUUID} from "node:crypto";

export const emailResending =  async (req: Request, res: Response) => {
    const email = req.body.email
    const user = await db.getCollections().userCollection.findOne({email});
    if(user){
        const userId = user._id.toString()
        const isConfirmed = await confirmationFlagCheck.isConfirmed(userId)
        if(isConfirmed){
             return res.status(400).send({ errorsMessages: [{ message: "email is already confirmed", field: "email" } ] });
        }

        const newConfirmationCode = randomUUID()
        await db.getCollections().userCollection.updateOne({email}, {$set: {'emailConfirmation.confirmationCode': newConfirmationCode}});
        console.log(user.email, newConfirmationCode, " user.email, newConfirmationCode")
        await authService.sendEmail(user.email, newConfirmationCode);
        return res.sendStatus(204)
    }
    return res.status(400).send({ errorsMessages: [{ message: "email doesnt exist", field: "email" } ] });
}