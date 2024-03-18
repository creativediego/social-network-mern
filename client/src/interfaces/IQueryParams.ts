export interface IQueryParams {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: string; // field name
  fields?: string[];
}
