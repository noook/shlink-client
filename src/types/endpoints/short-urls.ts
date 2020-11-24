export interface ShortUrlGetOptions {
  page?: number;
  searchTerm?: string;
  tags?: string[];
  orderBy?:  'longUrl-ASC' | 'longUrl-DESC' | 'shortCode-ASC' | 'shortCode-DESC' | 'dateCreated-ASC' | 'dateCreated-DESC' | 'visits-ASC' | 'visits-DESC';
  startDate?: string;
  endDate?: string;
}

export interface ShortUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  dateCreated: string;
  visitsCount: number;
  tags: string[];
  meta: {
    validSince: string | null;
    validUntil: string | null;
    maxVisits: number;
  };
  domain: string | null;
}

export interface ShortUrlsGetResponse {
  shortUrls: {
    data: ShortUrl[];
    pagination: {
      currentPage: number;
      pagesCount: number;
      itemsPerPage: number;
      itemsInCurrentPage: number;
      totalItems: number;
    };
  };
}

export interface ShortUrlOptions {
  longUrl: string;
  tags?: string[];
  validSince?: string;
  validUntil?: string;
  customSlug?: string;
  maxVisits?: number;
  findIfExists?: boolean;
  domain?: string;
  shortCodeLength?: number;
  validateUrl?: boolean;
}

export interface ShortTagsResponse {
  tags: string[];
}
