import {Response, Request, NextFunction} from 'express'

export const fromUTF8ToBase64 = (code: string) => {
    const buff2 = Buffer.from(code, 'utf8')
    const codedAuth = buff2.toString('base64')
    return codedAuth

}

export const adminMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string


    if (!auth) {
        res.status(401).json({})
        return
    }
    if(auth.slice(0, 5)!=="Basic"){
        res.status(401).json({})
        return
    }

    const codeAuth = fromUTF8ToBase64("admin:qwerty")
    if(auth.slice(6)!==codeAuth){
        res.status(401).json({})
        return
    }
    next()
}
