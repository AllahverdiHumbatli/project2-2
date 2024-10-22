// import {Request, Response} from "express";
// import {blogsRepositories} from "../../infrastructure/blogs-db-repository";
// import {blogsService} from "../../domain/blogs-service";
//
// enum HttpCodes {
//     Success = 200,
//     NoContent = 201,
// }
//
// export const deleteBlogById = async (req: Request, res: Response) => {
//     const isDeleted = await blogsService.deleteById(req.params.id)
//     {
//         if (isDeleted) {
//             return res.sendStatus(204)
//         }
//         return res.sendStatus(404)
//     }
// }
