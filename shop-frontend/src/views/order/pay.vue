<template>
  <div class="page-container">
    <div class="card-container">
      <h2 class="colored-title"> Choose Payment Method </h2>
      <div class="payment-methods">
        <div class="payment-method-card">
          <paypal />
        </div>
        <i></i><i></i><i></i><i></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import paypal from './components/paypal.vue';
  import { CheckoutInfo } from './cart.vue';
  import { OrderInfo } from '@/api/order/types';

  const orderInfo: OrderInfo = reactive({
    addressId: '',
    cartItems: [],
  });

  onMounted(() => {
    if (history.state.data) {
      const checkoutInfo: CheckoutInfo = JSON.parse(history.state.data);
      orderInfo.addressId = checkoutInfo.addressInfo!.id;
      for (const productId in checkoutInfo.cartItems) {
        orderInfo.cartItems.push({
          productId: productId,
          count: checkoutInfo.cartItems[productId].count,
        });
      }
    }
  });

  provide('orderInfo', orderInfo);
</script>

<style lang="less" scoped>
  .card-container {
    width: 100%;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    overflow: scroll;
    .payment-methods {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      .payment-method-card {
        width: 250px;
        height: 200px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        display: flex;
        padding: 10px;
        justify-content: center;
        align-items: center;
      }
      i {
        width: 200px;
      }
    }
  }
</style>
