import Axios from 'axios';
import { ShlinkClientOptions } from './types';
import { ApiClient } from './api';
import {
  ShortUrlGetOptions,
  ShortUrlOptions,
  ShortUrlsGetResponse,
  ShortUrl,
  ShortTagsResponse,
  QRCodeOptions,
  QRCodeDefaultOptions,
} from './types/endpoints/short-urls';
import { DomainsListItem, DomainsListResponse, ListTagsOptions, PaginationOptions, TagsListResponse, VisitData, VisitsPaginationOptions, VisitsStats } from './types/endpoints';
import { Paginated } from './types/endpoints/utils';
export class ShlinkClient {
  private url: string;
  private token: string;
  private client;

  public constructor({ url, token }: ShlinkClientOptions) {
    this.url = url.replace(/\/$/, '');
    this.token = token

    const instance = Axios.create({
      baseURL: this.url,
    });

    instance.interceptors.request.use((config) => {
      config.headers['X-Api-Key'] = this.token;
      return config;
    }, (error) => Promise.reject(error));

    this.client = new ApiClient(instance);
  }

  public healthCheck() {
    return this.client.get<{ status: number | string }>({ url: 'MONITORING' })
      .then(({ data }) => data);
  }

  public getShortUrls(options: ShortUrlGetOptions = {}) {
    return this.client.get<ShortUrlsGetResponse>({ url: 'SHORT_URLS' }, {
      params: options,
    })
      .then(({ data }) => data.shortUrls);
  }

  public getShortUrl(shortCode: string): Promise<ShortUrl> {
    return this.client.get<ShortUrl>({ url: 'SHORT_URL', params: { shortCode }})
      .then(({ data }) => data);
  }

  public editShortUrl(shortCode: string, options: Partial<Pick<ShortUrlOptions, 'longUrl' | 'validSince' | 'validUntil' | 'maxVisits' | 'validateUrl'>>, domain?: string): Promise<ShortUrl> {
    return this.client.patch({ url: 'SHORT_URL', params: { shortCode }}, options, {
      params: {
        domain,
      },
    })
      .then(() => this.getShortUrl(shortCode));
  }

  public static shortenUrl(baseURL: string, apiKey: string, longUrl: string, options: { format: 'txt', version?: number }): Promise<string>;
  public static shortenUrl(baseURL: string, apiKey: string, longUrl: string, options: { format: 'json', version?: number }): Promise<ShortUrl>;
  public static shortenUrl(baseURL: string, apiKey: string, longUrl: string, options: { format: 'txt' | 'json', version?: number } = { format: 'json' }): Promise<ShortUrl | string> {
    const client = new ApiClient(Axios.create({ baseURL: baseURL.replace(/\/$/, '') }));
    return client.get<ShortUrl | string>({ url: 'SHORTEN_URL', params: options as Record<string, string | number> }, {
      params: {
        apiKey,
        longUrl,
        format: options.format,
      },
    })
      .then(({ data }) => data);
  }

  public createShortUrl(options: ShortUrlOptions): Promise<ShortUrl> {
    return this.client.post<ShortUrl>({ url: 'SHORT_URLS' }, options)
      .then(({ data }) => data);
  }

  public deleteShortUrl(shortCode: string): Promise<string> {
    return this.client.delete({ url: 'SHORT_URL', params: { shortCode }})
      .then(() => shortCode)
  }

  public setShortUrlTags(shortCode: string, tags: string[]): Promise<ShortTagsResponse> {
    return this.client.put<ShortTagsResponse>({ url: 'SHORT_URL_TAGS', params: { shortCode }}, { tags })
      .then(({ data }) => data);
  }

  public countVisits(): Promise<VisitsStats> {
    return this.client.get<{ visits: VisitsStats }>({ url: 'VISITS' })
      .then(({ data }) => data.visits);
  }

  public getLinkVisits(shortCode: string, options: VisitsPaginationOptions = {}): Promise<Paginated<VisitData>> {
    return this.client.get<{ visits: Paginated<VisitData> }>({ url: 'LINK_VISITS', params: { shortCode }}, {
      params: options,
    })
      .then(({ data }) => data.visits);
  }

  public getTagVisits(tag: string, options: PaginationOptions = {}): Promise<Paginated<VisitData>> {
    return this.client.get<{ visits: Paginated<VisitData> }>({ url: 'TAG_VISITS', params: { tag }}, {
      params: options,
    })
      .then(({ data }) => data.visits);
  }

  public listTags(): Promise<TagsListResponse<ListTagsOptions<false>>>
  public listTags(options?: ListTagsOptions<false>): Promise<TagsListResponse<ListTagsOptions<false>>>
  public listTags(options?: ListTagsOptions<true>): Promise<TagsListResponse<ListTagsOptions<true>>>
  public listTags(options: ListTagsOptions = { withStats: false }): Promise<TagsListResponse<ListTagsOptions>> {
    return this.client.get<{ tags: TagsListResponse<ListTagsOptions>}>({ url: 'TAGS' }, {
      params: options,
    })
      .then(({ data }) => data.tags);
  }

  public renameTag(oldName: string, newName: string): Promise<{ tag: string }> {
    return this.client.put({ url: 'TAGS' }, {
      oldName,
      newName,
    })
      .then(() => ({ tag: newName }));
  }

  public deleteTags(...tags: string[]): Promise<{ deleted: string[] }> {
    return this.client.delete({ url: 'TAGS' }, {
      params: {
        tags,
      },
    })
      .then(() => ({
        deleted: tags,
      }));
  }

  public getDomains(): Promise<{ domains: DomainsListItem[] }> {
    return this.client.get<DomainsListResponse>({ url: 'DOMAINS' })
      .then(({ data }) => ({ domains: data.domains.data }));
  }

  public getPixel(shortCode: string): Promise<string> {
    return this.client.get<string>({ url: 'PIXEL', params: { shortCode }})
      .then(({ data }) => data);
  }

  public getQR(shortCode: string, options?: QRCodeOptions): Promise<{ format: string; data: string }> {
    return this.client.get({ url: 'QR_CODE', params: { shortCode }}, {
      params: {
        ...QRCodeDefaultOptions,
        ...options,
      }
    })
      .then(({ data, headers }) => ({
        format: headers['content-type'],
        data,
      }))
  }
}
