<template>
  <div class="cart-box">
    <h2 class="colored-title"> Cart Items </h2>
    <el-checkbox v-show="ifCart" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">Check all</el-checkbox>
    <div class="cart-item" v-for="(item, id) in cartItems" :key="id">
      <el-checkbox v-model="checkedItems[id]" @change="handleCheckedChange" />
      <div class="cart-item-image">
        <router-link :to="`/products/${item.name}_${id}`">
          <el-image :src="item.imagePath" fit="fill"
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
          size="default"
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
      <el-button type="primary"><router-link to="/"> There is nothing, go get some</router-link></el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Picture as IconPicture, CircleClose } from '@element-plus/icons-vue';
  import { useCartStore } from '@/store';
  import { CheckoutInfo } from '../cart.vue';

  const cartStore = useCartStore();
  const { cartItems } = storeToRefs(cartStore);

  onMounted(async () => {
    await cartStore.getCarts();
  });

  onBeforeUnmount(async () => {
    await cartStore.saveCart();
  });

  const ifCart = computed(() => {
    return Object.keys(cartItems.value).length > 0;
  });

  //checkbox
  const checkAll = ref(false);
  const isIndeterminate = ref(false);
  const checkedItems = ref({});
  onMounted(async () => {
    for (const id in cartItems.value) {
      checkedItems.value[id] = false;
    }
  });

  const handleCheckAllChange = (val: boolean) => {
    for (const id in cartItems.value) {
      checkedItems.value[id] = val;
    }
    isIndeterminate.value = false;
  };

  const checkedCount = ref(0);
  const handleCheckedChange = (val: boolean) => {
    if (val) {
      checkedCount.value += 1;
    } else {
      checkedCount.value -= 1;
    }
    if (checkedCount.value === Object.keys(cartItems.value).length) {
      checkAll.value = true;
      isIndeterminate.value = false;
    } else if (checkedCount.value === 0) {
      checkAll.value = false;
      isIndeterminate.value = false;
    } else {
      checkAll.value = false;
      isIndeterminate.value = true;
    }
  };

  watch(cartItems.value, () => {
    for (const id in checkedItems.value) {
      if (!cartItems.value[id]) {
        delete checkedItems.value[id];
        checkedCount.value -= 1;
        if (checkedCount.value === 0) {
          checkAll.value = false;
          isIndeterminate.value = false;
        }
      }
    }
  });

  const checkoutInfo = inject('checkoutInfo') as CheckoutInfo;
  watch(checkedItems.value, () => {
    checkoutInfo.cartItems = {};
    for (const id in checkedItems.value) {
      if (checkedItems.value[id]) {
        checkoutInfo.cartItems[id] = {
          ...cartItems.value[id],
        };
      }
    }
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
        height: 100px;
        width: 100px;
      }
    }
    .cart-item-info {
      width: 25%;
      min-width: 100px;
      font-size: 18px;
      font-weight: bold;
    }

    .el-input-number {
      width: 100%;
      min-width: 100px;
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

  :deep(.el-button) {
    font-size: 16px;
    font-weight: bold;
    padding: 20px;
    max-width: 100%;
    overflow: scroll;
    a {
      color: white !important;
    }
  }
</style>
