export interface VisitsStats {
  visitsCounts: number;
}

export interface VisitLocation {
  cityName: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  regionName: string;
  timezone: string;
}

export interface VisitData {
  referer: string;
  date: string;
  userAgent: string;
  visitLocation: VisitLocation | null;
}

export type VisitsPaginationOptions = {
  domain?: string;
} & PaginationOptions

export interface PaginationOptions {
  startDate?: string;
  endDate?: string;
  page?: number;
  itemsPerPage?: number;
}