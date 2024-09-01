import {Response, Request, NextFunction} from 'express'
import {validationResult} from 'express-validator'


export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const e = validationResult(req)
    if (!e.isEmpty()) {
        const eArray = e.array({onlyFirstError: true}) as  {path: string, msg : string}[]
        // console.log(eArray)


        res
            .status(400)
            .json({
                errorsMessages: eArray.map(errorObj => ({ message: errorObj.msg, field: errorObj.path,}))
            })
        return
    }

    next()
}