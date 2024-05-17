<template>
  <el-popover placement="bottom" :width="350" trigger="hover">
    <template #reference>
      <div class="cart-container">
        <div class="cart-img">
          <el-badge :value="cartCount" class="item">
            <el-icon><ShoppingCart /></el-icon>
          </el-badge>
        </div>
        <div class="cart-amount">
          <span id="cart-label">$</span>
          <span id="cart-amount">{{ cartTotal }} </span>
        </div>
      </div>
    </template>
    <div class="cart-box">
      <div class="cart-item" v-for="(item, id) in cartItems" :key="id">
        <div class="cart-item-image">
          <router-link :to="`/products/${item.name}_${id}`">
            <el-image style="width: 50px; height: 50px" :src="item.imagePath" fit="fill"
              ><template #error>
                <div class="error-image">
                  <el-icon><icon-picture /></el-icon>
                </div> </template
            ></el-image>
          </router-link>
        </div>
        <div class="cart-item-info">
          <router-link :to="`/products/${item.name}_${id}`">
            <el-text class="cart-item-name" size="large" truncated> {{ item.name }} </el-text>
            <div class="cart-item-price">$ {{ item.price }}</div>
          </router-link>
        </div>
        <div class="cart-item-count">
          <div class="cart-item-total">$ {{ (item.count * item.price).toFixed(2) }}</div>
          <el-input-number
            size="small"
            v-model="item.count"
            @change="cartStore.watchItem(id as string)"
            :min="0"
            :max="10"
            :step="1"
            step-strictly
          />
        </div>
        <a @click="cartStore.removeItem(id as string)">
          <el-icon><CircleClose /></el-icon>
        </a>
      </div>
      <div v-show="!ifCart" class="no-data">
        <h2>No Data</h2>
      </div>
      <div v-show="ifCart" class="buy-button">
        <el-button><router-link to="/order/cart">Buy Now</router-link></el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
  import { Picture as IconPicture, CircleClose } from '@element-plus/icons-vue';
  import { useCartStore } from '@/store';

  const cartStore = useCartStore();
  const { cartItems, cartCount, cartTotal } = storeToRefs(cartStore);

  onMounted(async () => {
    await cartStore.getCarts();
  });

  onBeforeUnmount(async () => {
    try {
      await cartStore.saveCart();
    } catch (err) {}
  });

  const ifCart = computed(() => {
    return Object.keys(cartItems.value).length > 0;
  });
</script>

<style lang="less" scoped>
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
  .cart-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #5433eb;

    .cart-img {
      padding-top: 5px;

      .el-icon {
        font-size: 30px;
      }
    }

    .cart-amount {
      padding: 0 10px;

      #cart-label {
        font-size: 20px;
        font-weight: bolder;
      }

      #cart-amount {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .cart-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #8976de;

    > div {
      padding: 0 10px;
    }

    .cart-item-image {
      padding-top: 5px;
    }
    .cart-item-info {
      width: 100px;
      font-size: 14px;
    }

    .el-input-number {
      width: 80px;
      margin-right: 10px;
      margin-bottom: 5px;
    }
    .cart-item-total {
      font-size: larger;
      font-weight: bold;
      padding-bottom: 5px;
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

  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }

  .buy-button {
    text-align: center;
    margin-top: 10px;
  }
</style>
