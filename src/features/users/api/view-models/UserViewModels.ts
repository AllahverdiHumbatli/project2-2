export type UsersQueryViewModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection:  'asc' | 'desc' | string
    searchLoginTerm: string | null
    searchEmailTerm: string | null
}

export type UsersViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: {
        id: string,
        login: string
        email: string
        createdAt: string
    }[]
} | {error: string }

export type CurrentUserViewModel = {
    email: string,
    login: string,
    userId: string
} | null
export type UserViewModel ={
    id: string | undefined
    login: string
    email: string
    createdAt: string
}
export type ValidationErrorForLoginEmail =
{
    message: string, field: string
}[]
