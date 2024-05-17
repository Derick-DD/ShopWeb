<template>
  <div class="price">
    <div class="price-info">
      <div class="price-detail">
        <span class="price-tag"> Item Subtotal Price </span>
        <span class="price-number">+${{ checkSubTotal }} </span>
      </div>
      <div class="price-detail">
        <span class="price-tag">Deliever Fee</span>
        <span class="price-number"> +${{ delieverFee.toFixed(2) }}</span>
      </div>
    </div>
    <div class="price-total">
      <span>Total</span> <span>${{ checkTotal }}</span>
    </div>
    <div class="check-out-button">
      <el-button type="primary" :disabled="checkCount === 0" @click="checkout()">Check out({{ checkCount }})</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CheckoutInfo, CheckoutPrice } from '../cart.vue';

  const router = useRouter();
  const checkoutInfo = inject('checkoutInfo') as CheckoutInfo;
  const checkCount = computed(() => {
    let totalCount = 0;
    for (const id in checkoutInfo.cartItems) {
      totalCount += checkoutInfo.cartItems[id].count;
    }
    return totalCount;
  });

  const checkSubTotal = computed(() => {
    let total = 0;
    for (const id in checkoutInfo.cartItems) {
      total += checkoutInfo.cartItems[id].count * checkoutInfo.cartItems[id].price;
    }
    return total.toFixed(2);
  });

  const delieverFee = computed(() => {
    return checkCount.value > 0 ? 8.0 : 0;
  });
  const checkTotal = computed(() => {
    return (delieverFee.value + parseFloat(checkSubTotal.value)).toFixed(2);
  });

  const checkout = () => {
    const checkPrice: CheckoutPrice = {
      checkSubTotal: parseFloat(checkSubTotal.value),
      delieverFee: delieverFee.value,
      checkTotal: parseFloat(checkTotal.value),
    };
    checkoutInfo.price = checkPrice;
    router.push({
      path: '/order/checkout',
      state: {
        data: JSON.stringify(checkoutInfo),
      },
    });
  };
</script>

<style lang="less" scoped>
  .price {
    max-width: 500px;
    margin: auto;
  }
  .price-detail {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
  }

  .price-total {
    display: flex;
    justify-content: space-between;
    color: #5433eb;
    font-size: 22px;
    font-weight: bolder;
  }
  .check-out-button {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .el-button {
      width: 100%;
      height: 40px;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
