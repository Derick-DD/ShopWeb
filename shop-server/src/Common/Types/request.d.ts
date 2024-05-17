import { ISerializeResponse } from '../Service/serializer.service';

export interface StatusOk extends ISerializeResponse {
  type: 'statusOk';
  attributes: {
    status: string;
    message: string;
  };
}

export interface ResponseMessage {
  status: string;
  message: string;
}
