// import {Request, Response} from 'express'
//
// import {postsService} from "../../domain/posts-service";
//
// import {BlogsQueryRepositories} from "../../../blogs/api/blogs-query-repository";
// import {postQueryRepository} from "../post-query-repository";
// import {PostsForBlogViewModel, PostsQueryViewModel} from "../view-models/postsViewModels";
// import {BlogViewModel} from "../../../blogs/api/view-models/blogsViewModels";
// import {helperForPostsPagination} from "./getController";
// import {blogsQueryRepository} from "../../../../composition-root/blogsCompositionRoot";
//
// export const getAllPostsForBlog = async (req: Request, res: Response<any /*OutputVideoType[]*/>) => {
//
//     const sanitizedQuery:PostsQueryViewModel = helperForPostsPagination(req.query as {[key: string]: string| undefined})
//
//
//     const blog:BlogViewModel = await blogsQueryRepository.getById(req.params.id)
//     if(!blog){
//         res.sendStatus(404)
//         return
//     }
//
//     const allPosts:PostsForBlogViewModel =  await postQueryRepository.getAllPostsForOneBlog(sanitizedQuery, req.params.id)
//     console.log("all posts",allPosts)
//
//         res.status(200).send(allPosts)
//         return
//
//
// };
