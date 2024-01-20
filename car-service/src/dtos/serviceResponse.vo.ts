export interface ServiceResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
