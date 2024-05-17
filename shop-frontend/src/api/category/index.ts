import { get, post, patch, del } from '@/utils/http/axios';
import { ResponseMessage } from '@/utils/http/axios/type';
import { CategoryInfo } from './types';

const baseURL = '/Categories';

const findAllCategoris = async () => get<CategoryInfo[]>({ url: baseURL });
const findOneCategory = async (id: string) => get<CategoryInfo>({ url: `${baseURL}/${id}` });
const createCategory = async (data: { name: string }) => post<CategoryInfo>({ url: baseURL, data });
const updateCategory = async (id: string, data: { name: string }) => patch<CategoryInfo>({ url: `${baseURL}/${id}`, data });
const removeCategory = async (id: string) => del<ResponseMessage>({ url: `${baseURL}/${id}` });

export { findAllCategoris, findOneCategory, createCategory, updateCategory, removeCategory };
