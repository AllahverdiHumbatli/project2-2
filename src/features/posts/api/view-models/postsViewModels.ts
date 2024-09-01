export type PostsQueryViewModel = {

    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection:  'asc' | 'desc';

}
export type PostsViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: {
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: string
    }[] }
    | {error: string }

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
} | undefined

export type PostsForBlogViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: {
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: string
}[] }
    | {error: string}