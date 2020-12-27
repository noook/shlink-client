export interface DomainsListResponse {
  domains: {
    data: DomainsListItem[];
  }
}

export interface DomainsListItem {
  domain: string;
  isDefault: boolean;
}