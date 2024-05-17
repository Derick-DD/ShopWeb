import request, { get, post, patch, del } from '@/utils/http/axios';
import { CreateProduct, ProductFullInfo, ProductInfo } from './types';
import { ResponseMessage } from '@/utils/http/axios/type';

const baseURL = '/products';

const findAllProducts = async () => get<ProductInfo[]>({ url: baseURL });
const findProductsByCategory = async (categoryId: string) => get<ProductFullInfo[]>({ url: `${baseURL}/ofCategory/${categoryId}` });
const findOneProduct = async (id: string) => get<ProductFullInfo>({ url: `${baseURL}/${id}` });
const createProduct = async (data: CreateProduct) => post<ProductFullInfo>({ url: baseURL, data });
const updateProduct = async (id: string, data: Partial<CreateProduct>) => patch<ProductFullInfo>({ url: `${baseURL}/${id}`, data });
const removeProduct = async (id: string) => del<ResponseMessage>({ url: `${baseURL}/${id}` });
// const uploadProductPic = async (id: string, file: File) =>
//   post({ url: `${baseURL}/${id}/upload`, data: { file: file }, headers: { 'Content-Type': 'multipart/form-data' } });
const uploadProductPic = (id: string, file: any) => {
  return request({
    url: `/products/${id}/upload`,
    method: 'post',
    data: { file: file.raw },
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  });
};
export { findAllProducts, findProductsByCategory, findOneProduct, createProduct, updateProduct, removeProduct, uploadProductPic };
