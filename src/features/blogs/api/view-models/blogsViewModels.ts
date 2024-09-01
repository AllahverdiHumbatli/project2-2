export type BlogsViewModel  = {

        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: {
            id: string;
            name: string;
            description: string;
            websiteUrl: string;
            createdAt: string;
            isMembership: boolean;
        }[];
    } | {error: string}

export type BlogsQueryViewModel = {

    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection:  'asc' | 'desc';
    searchNameTerm: string | null

}

export type BlogViewModel = {

    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
} | false
