// import {Request, Response} from 'express'
//
//
// import {blogsQueryRepositories, } from "../blogs-query-repository";
// import {BlogsQueryViewModel} from "../view-models/blogsViewModels";
// //TODO: rename
//
//  const helperForBlogPagination = (query: {[key: string]: string| undefined }) :BlogsQueryViewModel => {
//     const sortDirection = (query.sortDirection === 'asc' || query.sortDirection === 'desc')
//         ? query.sortDirection
//         : 'desc';
//     return {
//         pageNumber: query.pageNumber ? +query.pageNumber : 1,
//         pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
//         sortBy: query.sortBy ? query.sortBy : 'createdAt',
//         sortDirection: sortDirection,
//         searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
//     }
// }
//
// export const getBlogsController = async (req: Request, res: Response<any>)  => {
//     const sanitizedQuery = helperForBlogPagination(req.query as {[key: string]: string| undefined})
//     const allBlogs = await blogsQueryRepositories.getBlogs(sanitizedQuery)
//     res.status(200).send(allBlogs)
// }