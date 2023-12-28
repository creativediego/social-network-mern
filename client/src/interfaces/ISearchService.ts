export type SearchResult<T> = T[];

export interface ISearchService<T> {
  search(query: string): Promise<T>;
}
