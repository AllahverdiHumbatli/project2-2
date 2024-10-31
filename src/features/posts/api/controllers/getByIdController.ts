// import {Request, Response} from 'express'
// import {postRepositories} from "../../infrastructure/post-db-repository";
// import {db} from "../../../../common/db/mongo-db";
// import {postsService} from "../../domain/posts-service";
// import {postQueryRepository} from "../post-query-repository";
// import {PostViewModel} from "../view-models/postsViewModels";
//
// export const getByIdController = async (req: Request, res: Response) => {
//     const post:PostViewModel = await postQueryRepository.getPostById(req.params.id);
//     if (post) {
//         res.status(200).send(post);
//         return
//     }
//     res.sendStatus(404)
//     return
// }