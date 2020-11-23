import Axios from 'axios';
import { ShlinkClientOptions } from './types';
import { ApiClient } from './api';
import {
  ShortUrlGetOptions,
  ShortUrlOptions,
  ShortUrlsGetResponse,
  ShortUrl,
  ShortTagsResponse,
} from './types/endpoints/short-urls';
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

  public getShortUrls(options: ShortUrlGetOptions) {
    return this.client.get<ShortUrlsGetResponse>({ url: 'SHORT_URLS' }, {
      params: options,
    })
      .then(({ data }) => data.shortUrls);
  }

  public getShortUrl(shortCode: string): Promise<ShortUrl> {
    return this.client.get<ShortUrl>({ url: 'SHORT_URL', params: { shortCode }})
      .then(({ data }) => data);
  }

  public editShortUrl(shortCode: string, options: Partial<Pick<ShortUrlOptions, 'longUrl' | 'validSince' | 'validUntil' | 'maxVisits' | 'validateUrl'>>, domain?: string) {
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
}
