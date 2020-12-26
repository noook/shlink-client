import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

const ROUTES = {
  MONITORING: '/rest/health',

  /* Short URLs */
  SHORT_URLS: '/rest/v{:version}/short-urls',
  SHORT_URL: '/rest/v{:version}/short-urls/{:shortCode}',
  SHORTEN_URL: '/rest/v{:version}/short-urls/shorten',
  SHORT_URL_TAGS: '/rest/v{:version}/short-urls/{:shortCode}/tags',

  /* Tags */
  TAGS: '/rest/v{:version}/tags',
};

interface RouteParam {
  url: keyof typeof ROUTES;
  params?: Record<string, number | string>;
}

export class ApiClient {
  public constructor(private instance: AxiosInstance) {}

  private replaceParams(route: keyof typeof ROUTES, params: Record<string, number | string> = {}): string {
    params = {
      version: 2,
      ...params,
    };
    const url = ROUTES[route];
    return Object.entries(params).reduce((acc, [key, value]) => {
      return acc.replace(`{:${key}}`, value.toString());
    }, url);
  }

  public get<T = any, R = AxiosResponse<T>>(route: RouteParam, config?: AxiosRequestConfig): Promise<R> {
    return this.instance
      .get(
        this.replaceParams(route.url, route.params),
        config,
      );
  }
  public delete<T = any, R = AxiosResponse<T>>(route: RouteParam, config?: AxiosRequestConfig): Promise<R> {
    return this.instance
      .delete(
        this.replaceParams(route.url, route.params),
        config,
      );
  }
  public post<T = any, R = AxiosResponse<T>>(route: RouteParam, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance
      .post(
        this.replaceParams(route.url, route.params),
        data,
        config,
      );
  }
  public put<T = any, R = AxiosResponse<T>>(route: RouteParam, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance
      .put(
        this.replaceParams(route.url, route.params),
        data,
        config,
      );
  }
  public patch<T = any, R = AxiosResponse<T>>(route: RouteParam, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance
      .patch(
        this.replaceParams(route.url, route.params),
        data,
        config,
      );
  }
}