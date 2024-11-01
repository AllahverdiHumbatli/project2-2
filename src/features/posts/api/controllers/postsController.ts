import {NextFunction, Request, Response} from "express";
import {PostsService, } from "../../domain/posts-service";
import { PostsQueryRepository} from "../post-query-repository";
import {PostsForBlogViewModel, PostsQueryViewModel, PostViewModel} from "../view-models/postsViewModels";

import {BlogViewModel} from "../../../blogs/api/view-models/blogsViewModels";
import {blogsQueryRepository} from "../../../../composition-root/blogsCompositionRoot";
import {CommentsService, StatusCode} from "../../../comments/domain/comments-service";
import { CommentsQueryRepository} from "../../../comments/api/comments-query-repository";
import {CommentsQueryViewModel} from "../../../comments/view-models/commentsViewModels";

export class PostsController {
    private postsService: PostsService;
    private postQueryRepository: PostsQueryRepository;
    constructor() {
        this.postsService = new PostsService();
        this.postQueryRepository = new PostsQueryRepository();
    }
    async createPost(req: Request, res: Response, next: NextFunction) {

        const newPostId = await this.postsService.postPOST(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        const newPost = await this.postQueryRepository.getPostById(newPostId)
        res.status(201).send(newPost);
        return
    }
     helperForPostsPagination (query: {[key: string]: string| undefined}):PostsQueryViewModel {
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
    async getPosts  (req: Request, res: Response<any /*OutputVideoType[]*/>)  {
        const sanitizedQuery = this.helperForPostsPagination(req.query as {[key: string]: string| undefined})
        const allPosts =  await this.postQueryRepository.getPosts(sanitizedQuery) //вопрос
        res.status(200).send(allPosts)
        return
    }
    async getPostById (req: Request, res: Response) {
        const post:PostViewModel = await this.postQueryRepository.getPostById(req.params.id);
        if (post) {
            res.status(200).send(post);
            return
        }
        res.sendStatus(404)
        return
    }
    async createPostByBlogId(req: Request, res: Response, next: NextFunction)  {
        const isValidObjectId = ((id:string) => { return /^[0-9a-fA-F]{24}$/.test(id) } )
        console.log("true or false",isValidObjectId)
        if(isValidObjectId(req.params.id)){
            const newPostId = await this.postsService.postPOSTByBlogId(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
            if(newPostId){
                const newPost = await this.postQueryRepository.getPostById(newPostId)
                res.status(201).send(newPost);
                return
            }
            res.sendStatus(404)
            return
        }
        res.sendStatus(404)
        return
    }
    async updatePostById(req: Request, res: Response)  {

        const updatePost:boolean = await this.postsService.uptadePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if(updatePost) {
            res.sendStatus(204);
            return
        }
        return res.sendStatus(404)
    }
    async deletePostById (req: Request, res: Response) {
        const deletePostByIdContoller:boolean = await this.postsService.deletePostById(req.params.id);

        if (deletePostByIdContoller) {
            res.sendStatus(204)
            return
        }
        return res.sendStatus(404)
    }
     async getAllPostsForBlog (req: Request, res: Response<any /*OutputVideoType[]*/>) {

        const sanitizedQuery:PostsQueryViewModel = this.helperForPostsPagination(req.query as {[key: string]: string| undefined})


        const blog:BlogViewModel = await blogsQueryRepository.getById(req.params.id)
        if(!blog){
            res.sendStatus(404)
            return
        }

        const allPosts:PostsForBlogViewModel =  await this.postQueryRepository.getAllPostsForOneBlog(sanitizedQuery, req.params.id)
        console.log("all posts",allPosts)

        res.status(200).send(allPosts)
        return
    }
    async createComment(req: Request, res: Response, next: NextFunction)  {

        const isPostExist =  await this.postQueryRepository.getPostById(req.params.id)
        if(isPostExist) {
            const newCommentId: string = await new CommentsService().createComment(req.body.content, req.user.id, req.user.login, req.params.id)
            const newComment = await new CommentsQueryRepository().getCommentById(newCommentId)
            if(newComment.statusCode === StatusCode.Success){
                return res.status(201).send(newComment.data)
            }
        }
        return res.sendStatus(404)
    }
    helper(query: {[key: string]: string| undefined}):CommentsQueryViewModel {
        const sortDirection = (query.sortDirection === 'asc' || query.sortDirection === 'desc')
            ? query.sortDirection as 'asc' | 'desc'
            : 'desc';
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: sortDirection
        } }

    async getPostComments  (req: Request, res: Response<any /*OutputVideoType[]*/>)  {
        const isPostExist = await this.postQueryRepository.getPostById(req.params.id)
        if (!isPostExist) {
            res.sendStatus(404);
            return
        }



        const sanitizedQuery = this.helper(req.query as {[key: string]: string| undefined})
        const allCommentsForPost =  await new CommentsQueryRepository()
            .getCommentsForPost(sanitizedQuery, req.params.id, req.user?.id ?? null)
        console.log("res from contoller", allCommentsForPost)//вопрос
        res.status(200).send(allCommentsForPost)
        return
    };
}
export const postsController: PostsController = new PostsController()