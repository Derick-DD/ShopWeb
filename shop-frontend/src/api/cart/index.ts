import { get, patch, del } from '@/utils/http/axios';
import { CartInfo } from './types';
import { ResponseMessage } from '@/utils/http/axios/type';
import { CartUpdate } from '@/store/modules/cart/types';

enum URL {
  base = '/carts',
  updateCart = '/carts/update',
}

const getCart = async () => get<CartInfo[]>({ url: URL.base });
const clearCart = async () => del<ResponseMessage>({ url: URL.base });
const updateCart = async (data: CartUpdate[]) => patch<ResponseMessage>({ url: URL.updateCart, data });

export { getCart, clearCart, updateCart };
