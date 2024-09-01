import {Request, Response} from 'express'
import {postQueryRepository} from "../post-query-repository";
import {PostsQueryViewModel} from "../view-models/postsViewModels";

export const helperForPostsPagination = (query: {[key: string]: string| undefined}):PostsQueryViewModel => {
    let sortDirection = (query.sortDirection === 'asc' || query.sortDirection === 'desc')
        ? query.sortDirection as 'asc' | 'desc'
        : 'desc';
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: sortDirection
    } }
//question for type for getController in post object
export const getController = async (req: Request, res: Response<any /*OutputVideoType[]*/>) => {
    const sanitizedQuery = helperForPostsPagination(req.query as {[key: string]: string| undefined})
    const allPosts =  await postQueryRepository.getPosts(sanitizedQuery) //вопрос
    res.status(200).send(allPosts)
    return
};
