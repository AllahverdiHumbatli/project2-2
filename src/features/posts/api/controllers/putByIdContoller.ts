// import {NextFunction, Request, Response} from 'express';
// import {postsService} from "../../domain/posts-service";
//
//
// export const putByIdContoller = async (req: Request, res: Response) => {
//
//     const uptadePost:boolean = await postsService.uptadePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
//     if(uptadePost) {
//         res.sendStatus(204);
//         return
//     }
//     return res.sendStatus(404)
// }