import { get, post, del } from '@/utils/http/axios';
import { ResponseMessage } from '@/utils/http/axios/type';
import axios from 'axios';
import { OrderFullRes, OrderInfo, OrderRes, UserAddress, UserAddressRes } from './types';

const searchHKAddress = async (address: string): Promise<any> => {
  return axios
    .get(`/addressData/locationSearch?q=${address}`)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};
const baseUrl = '/order';
const addressUrl = baseUrl + '/address';

//order record
const getAllOrdersRecord = async () => get<OrderFullRes[]>({ url: `${baseUrl}/all` });
const getOrdersRecord = async () => get<OrderRes[]>({ url: baseUrl });

//paypal
const createPaypalOrder = async (data: OrderInfo) => post<any>({ url: `${baseUrl}/create-paypal-order`, data });
const completePaypalOrder = async (orderId: string) => get<any>({ url: `${baseUrl}/complete-paypal-order/${orderId}` });
const cancelPaypalOrder = async (orderId: string) => get<any>({ url: `${baseUrl}/cancel-paypal-order/${orderId}` });

//address
const getAddress = async () => get<UserAddressRes[]>({ url: addressUrl });
const deleteAddress = async (addressId: string) => del<ResponseMessage>({ url: `${addressUrl}/${addressId}` });
const addAddress = async (data: UserAddress) => post<ResponseMessage>({ url: addressUrl, data });

export {
  getAllOrdersRecord,
  getOrdersRecord,
  createPaypalOrder,
  completePaypalOrder,
  cancelPaypalOrder,
  searchHKAddress,
  getAddress,
  deleteAddress,
  addAddress,
};
