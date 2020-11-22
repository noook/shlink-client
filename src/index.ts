import Axios from 'axios';
import { ShlinkClientOptions } from './types';
import { ApiClient } from './api';

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
}
