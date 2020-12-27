export * from './monitoring';
export * from './tags';
export * from './domains';

export interface GenericError {
  type: string;
  title: string;
  detail: string;
  status: number;
}
