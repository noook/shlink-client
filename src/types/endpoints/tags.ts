export interface ListTagsOptions<D = boolean> {
  withStats: D;
}

export type TagsListResponse<ReqOptions extends ListTagsOptions> = TagList & (ReqOptions extends ListTagsOptions<true> ? ListTagsStats : {});

export interface TagList {
  data: string[];
  stats?: TagStats[];
}

export interface ListTagsStats {
  stats: TagStats[];
}

export interface TagStats {
  tag: string;
  shortUrlsCount: number;
  visitsCount: number;
}
