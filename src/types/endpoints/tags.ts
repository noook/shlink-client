export interface ListTagsOptions<D = boolean> {
  withStats: D;
}

export type TagsListResponse<ReqOptions extends ListTagsOptions> = TagList & (ReqOptions extends { withStats: true } ? ListTagsStats : {});

export interface TagList {
  data: string[];
  stats?: TagStats[];
}

export interface TagStats {
  tag: string;
  shortUrlsCount: number;
  visitsCount: number;
}

export interface ListTagsStats {
  stats: TagStats[];
}
