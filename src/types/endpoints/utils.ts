export interface Paginated<T> {
  data: T[];
  pagination: Pagination
}

export interface Pagination {
  currentPAge: number;
  pagesCount: number;
  itemsPerPage: number;
  itemsInCurrentPage: number;
  totalItems: number;
}