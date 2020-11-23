export * from './monitoring';

export interface GenericError {
  type: string
  title: string
  detail: string
  status: number
}
