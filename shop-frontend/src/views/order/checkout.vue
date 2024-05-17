<template>
  <div class="page-container" v-if="checkoutInfo">
    <h1 class="colored-title">Check Out</h1>

    <div class="card-wrapper">
      <h2 class="colored-title"
        ><el-icon><Location /></el-icon> Deliver To
      </h2>
      <div class="address-container" v-if="checkoutInfo.addressInfo">
        <div class="address-info">
          <div class="address">
            <div class="main-address">{{ checkoutInfo.addressInfo.addressDetail }}, {{ checkoutInfo.addressInfo.address }}</div>
          </div>
          <div class="contact">
            <span class="name">{{ checkoutInfo.addressInfo.name }}</span>
            <span class="phone"> {{ checkoutInfo.addressInfo.phone }} </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-wrapper">
      <div class="cart-box">
        <h2 class="colored-title"> Cart Items </h2>
        <div class="cart-item" v-for="(item, id) in checkoutInfo.cartItems" :key="id">
          <div class="cart-item-image">
            <el-image :src="item.imagePath" fit="fill"
              ><template #error>
                <div class="error-image">
                  <el-icon><icon-picture /></el-icon>
                </div> </template
            ></el-image>
          </div>
          <div class="cart-item-info">
            <el-text class="cart-item-name" size="large" truncated> {{ item.name }} </el-text>
          </div>
          <div class="cart-item-count"> QTY: {{ item.count }} </div>
          <div class="cart-item-price">
            <div class="cart-item-total">$ {{ (item.count * item.price).toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-wrapper">
      <div class="price">
        <div class="price-info">
          <div class="price-detail">
            <span class="price-tag"> Item Subtotal Price </span>
            <span class="price-number">+${{ checkoutInfo.price!.checkSubTotal.toFixed(2) }} </span>
          </div>
          <div class="price-detail">
            <span class="price-tag">Deliever Fee</span>
            <span class="price-number"> +${{ checkoutInfo.price!.delieverFee.toFixed(2) }}</span>
          </div>
        </div>
        <div class="price-total">
          <span>Total</span> <span>${{ checkoutInfo.price!.checkTotal.toFixed(2) }}</span>
        </div>
        <div class="check-out-button">
          <el-button type="primary" @click="pay()">Pay</el-button>
        </div>
      </div>
    </div>
  </div>
  <div v-else> <h2 class="colored-title">Your checkout failed, please check your cart and try again later</h2> </div>
</template>

<script setup lang="ts">
  import { CheckoutInfo } from './cart.vue';

  const checkoutInfo: Ref<CheckoutInfo | null> = ref(null);
  onMounted(() => {
    if (history.state.data) {
      checkoutInfo.value = JSON.parse(history.state.data);
    }
  });

  const router = useRouter();
  const pay = () => {
    router.push({
      path: '/order/pay',
      state: {
        data: JSON.stringify(checkoutInfo.value),
      },
    });
  };
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

  .address-container {
    display: flex;
    justify-content: space-between;
    .address {
      margin-bottom: 20px;
      .main-address {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .detail-address {
        font-size: 14px;
      }
    }
    .contact {
      font-size: 16px;
      font-weight: 500;
      .name {
        margin-right: 10px;
      }
    }
  }

  .error-image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
    .el-icon {
      font-size: 30px;
    }
  }

  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid #8976de;

    > div {
      padding: 0 10px;
    }

    .cart-item-image {
      padding-top: 5px;
      .el-image {
        height: 70px;
        width: 70px;
      }
    }
    .cart-item-info {
      width: 25%;
      min-width: 100px;
      font-size: 18px;
      line-height: 18px;
      font-weight: bold;
    }

    .el-input-number {
      width: 100%;
      min-width: 100px;
      margin-right: 10px;
      margin-bottom: 5px;
    }

    .cart-item-count {
      font-size: 16px;
      font-weight: bold;
    }

    .cart-item-total {
      font-size: larger;
      font-weight: bold;
      text-align: center;
      margin-right: 10px;
    }
    .el-icon {
      font-size: 20px;
      padding-top: 5px;
      color: #5433eb;
      cursor: pointer;
      :hover {
        font-size: 22px;
        color: #8976de;
      }
    }
  }

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
