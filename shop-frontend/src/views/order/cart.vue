<template>
  <div class="page-container">
    <h1 class="colored-title">My Cart</h1>
    <div class="card-wrapper"> <addressCard /></div>
    <div class="card-wrapper"> <cartCard /></div>
    <div class="card-wrapper"> <checkOutCard /></div>
  </div>
</template>

<script setup lang="ts">
  import { UserAddressRes } from '@/api/order/types';
  import addressCard from './components/addressCard.vue';
  import cartCard from './components/cartCard.vue';
  import checkOutCard from './components/checkOutCard.vue';
  import { Cart } from '@/store/modules/cart/types';
  import { useCartStore } from '@/store';

  export interface CheckoutPrice {
    checkSubTotal: number;
    delieverFee: number;
    checkTotal: number;
  }

  export interface CheckoutInfo {
    addressInfo: UserAddressRes | null;
    cartItems: Cart | null;
    price: CheckoutPrice | null;
  }

  const checkoutInfo: CheckoutInfo = reactive({
    addressInfo: null,
    cartItems: null,
    price: null,
  });

  provide('checkoutInfo', checkoutInfo);

  onMounted(async () => {
    const cartStore = useCartStore();
    await cartStore.getCarts(true);
  });
</script>

<style lang="less" scoped>
  .page-container {
    max-width: 600px;
    margin: auto;
  }
  .card-wrapper {
    width: 100%;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
    overflow: scroll;
  }
</style>
