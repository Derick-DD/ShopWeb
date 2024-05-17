export interface RequestOptions {
  // Whether to process the request result
  isTransformResponse?: boolean;
}

export interface IResponse<T> {
  code: number | string;
  msg: string;
  data: {
    type: string;
    attributes: T;
  };
}

export interface ResponseMessage {
  status: string;
  message: string;
}

export interface BaseInfoRes {
  id: string;
  created_at: string;
  updated_at: string;
}
