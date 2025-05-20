export default interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
  success: boolean;
}
