<template>
  <div class="flex-wrap">
    <el-card v-for="product in productsData" :key="product.id" class="box-card" style="width: 250px">
      <router-link :to="`/products/${product.name}_${product.id}`">
        <el-image style="width: 180px; height: 180px" :src="product.imagePath" fit="fill" lazy />
      </router-link>

      <div class="product-price">
        <span class="label">$</span>
        <span class="number">{{ product.price }}</span>
      </div>
      <div class="product-name">
        <el-text truncated>{{ product.name }}</el-text>
      </div>
      <div class="product-button">
        <el-button v-if="!cartItems[product.id]" type="primary" @click="cartStore.addToCart(product)">Add to Cart</el-button>
        <el-input-number
          v-else
          size="large"
          v-model="cartItems[product.id].count"
          @change="cartStore.watchItem(product.id)"
          :min="0"
          :max="10"
          :step="1"
          step-strictly
        />
      </div>
    </el-card>
    <i></i><i></i><i></i><i></i><i></i>
  </div>
</template>

<script setup lang="ts">
  import { findAllProducts, findProductsByCategory } from '@/api/product';
  import { ProductFullInfo, ProductInfo } from '@/api/product/types';
  import { useCartStore } from '@/store';
  import { RouteLocationNormalizedLoadedTyped } from 'unplugin-vue-router';

  const router = useRouter();

  const cartStore = useCartStore();
  const { cartItems } = storeToRefs(cartStore);

  const productsData: Ref<ProductFullInfo[]> | Ref<ProductInfo[]> = ref([]);

  //determine whether show all products all one category
  watch(
    () => router.currentRoute.value,
    async (to) => {
      changeList(to);
    },
  );

  onMounted(async () => {
    changeList(router.currentRoute.value);
  });

  async function changeList(currentRoute: RouteLocationNormalizedLoadedTyped<any>) {
    const categoryId: string = currentRoute.params.id;
    if (categoryId) {
      try {
        productsData.value = (await findProductsByCategory(categoryId)).data.attributes;
      } catch {
        router.push('/404');
      }
    } else {
      productsData.value = (await findAllProducts()).data.attributes;
    }
  }
</script>

<style lang="less" scoped>
  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    > i {
      width: 250px;
      margin: 0 30px;
    }
  }
  .el-card {
    margin: 30px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    height: 350px;

    .product-price {
      padding: 5px 0;
      font-weight: bolder;
      font-size: 20px;
      .label {
        font-weight: bolder;
        color: #5433eb;
        font-size: larger;
      }
    }

    .el-text {
      max-width: 180px;
      font-size: large;
    }

    .product-button {
      width: 180px;
      display: flex;
      margin-top: 10px;
      justify-content: center;
      .el-button {
        width: 100%;
      }
    }
  }
</style>
