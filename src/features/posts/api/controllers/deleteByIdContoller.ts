// import {Request, Response} from 'express';
// import {postsService} from "../../domain/posts-service";
//
//
//
// export const deletePostById = async (req: Request, res: Response) => {
//     const deletePostByIdContoller:boolean = await postsService.deletePostById(req.params.id);
//
//     if (deletePostByIdContoller) {
//         res.sendStatus(204)
//         return
//     }
//     return res.sendStatus(404)
// }