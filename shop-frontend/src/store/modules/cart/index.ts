import { defineStore } from 'pinia';
import { updateCart, getCart } from '@/api/cart';
import { CartState, CartUpdate } from './types';
import { ElMessage } from 'element-plus';
// import { isEqual } from 'lodash';
import { ProductInfo } from '@/api/product/types';
import { useUserStore } from '../user';

export const useCartStore = defineStore('cart', {
  persist: true,
  state: (): CartState => ({
    cartItems: {},
    originCart: {},
    ifChanged: true,
  }),
  getters: {
    cartTotal(state): string {
      let total = 0;
      for (const id in state.cartItems) {
        total += state.cartItems[id].count * state.cartItems[id].price;
      }
      return total.toFixed(2);
    },
    cartCount(state): number {
      let totalCount = 0;
      for (const id in state.cartItems) {
        totalCount += state.cartItems[id].count;
      }
      return totalCount;
      // return Object.keys(state.cartItems).length;
    },
  },
  actions: {
    isProductInCart(productId: string) {
      return productId in this.cartItems;
    },
    addToCart(product: ProductInfo) {
      const userStore = useUserStore();
      const { user_id } = storeToRefs(userStore);
      if (!user_id.value) {
        userStore.popSignIn();
        return;
      }
      this.cartItems[product.id] = {
        name: product.name,
        price: product.price,
        imagePath: product.imagePath,
        count: 1,
      };
      this.saveCart();
    },
    removeItem(id: string) {
      if (this.cartItems[id]) {
        delete this.cartItems[id];
      }
    },

    watchItem(id: string) {
      const count = this.cartItems[id].count;
      if (count <= 0) {
        this.removeItem(id);
      }
      if (count >= 10) {
        ElMessage.warning('Most add 10 for one product');
      }
      this.saveCart();
    },

    async getCarts(ifRequest = false) {
      // use ifRequest to decide whether to manually get new data from server
      if (!this.ifChanged && !ifRequest) {
        return;
      }
      const carts = (await getCart()).data.attributes;
      this.cartItems = {};
      carts.forEach((item) => {
        this.cartItems[item.product.id] = {
          count: item.count,
          name: item.product.name,
          price: item.product.price,
          imagePath: item.product.imagePath,
        };
      });
      this.originCart = { ...this.cartItems };
    },

    async saveCart() {
      // if (isEqual(this.cartItems, this.originCart)) {
      //   this.ifChanged = false;
      //   return;
      // } else {
      //   const newCart: CartUpdate[] = [];
      //   for (const id in this.cartItems) {
      //     newCart.push({
      //       productId: id,
      //       count: this.cartItems[id].count,
      //     });
      //   }
      //   await updateCart(newCart);
      //   this.originCart = { ...this.cartItems };
      //   this.ifChanged = true;
      // }
      const newCart: CartUpdate[] = [];
      for (const id in this.cartItems) {
        newCart.push({
          productId: id,
          count: this.cartItems[id].count,
        });
      }
      await updateCart(newCart);
      this.originCart = { ...this.cartItems };
      this.ifChanged = true;
    },
  },
});
