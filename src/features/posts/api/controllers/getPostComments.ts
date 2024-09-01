import {Request, Response} from 'express'
import {commentsQueryRepositories} from "../../../comments/api/comments-query-repository";
import {postQueryRepository} from "../post-query-repository";
import {CommentsQueryViewModel} from "../../../comments/view-models/commentsViewModels";

const helper = (query: {[key: string]: string| undefined}):CommentsQueryViewModel => {
    const sortDirection = (query.sortDirection === 'asc' || query.sortDirection === 'desc')
        ? query.sortDirection as 'asc' | 'desc'
        : 'desc';
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: sortDirection
    } }
export const getPostComments = async (req: Request, res: Response<any /*OutputVideoType[]*/>) => {
    const isPostExsist = await postQueryRepository.getPostById(req.params.id)
    if (!isPostExsist) {
        res.sendStatus(404);
        return
    }

    const sanitizedQuery = helper(req.query as {[key: string]: string| undefined})
    const allCommentsForPost =  await commentsQueryRepositories.getCommentsForPost(sanitizedQuery, req.params.id) //вопрос
    res.status(200).send(allCommentsForPost)
    return
};