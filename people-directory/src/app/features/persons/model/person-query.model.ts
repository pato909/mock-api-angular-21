export interface PersonsListQuery {
    search: string
    sortBy: string
    order: 'asc' | 'desc'
    page: number
    limit: number
}