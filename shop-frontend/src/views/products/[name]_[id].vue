<template>
  <div class="page-container">
    <noProduct v-if="notValidProduct" />
    <div class="product-container" v-else>
      <productImage v-show="!isSmallScreen" :images="images" />
      <div class="carousel-container" v-show="isSmallScreen">
        <el-carousel :autoplay="false">
          <el-carousel-item v-for="(image, id) in images" :key="id">
            <img :src="image" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="product-info">
        <h1 class="product-name">
          {{ product.name }}
        </h1>
        <div class="product-price">
          <span class="label">$</span>
          <span class="number">{{ product.price }}</span>
        </div>
        <div class="product-button">
          <el-button v-if="!cartStore.cartItems[product.id]" type="primary" @click="cartStore.addToCart(product)">Add to Cart</el-button>
          <el-input-number
            v-else
            size="large"
            v-model="cartStore.cartItems[product.id].count"
            @change="cartStore.watchItem(product.id)"
            :min="0"
            :max="10"
            :step="1"
            step-strictly
          />
        </div>
        <div class="product-description">
          <h2 class="product-des-title">Product Description</h2>
          {{ product.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { findOneProduct } from '@/api/product';
  import { ProductFullInfo } from '@/api/product/types';
  import { routerParam } from '@/router/types';
  import { useCartStore } from '@/store';
  import productImage from './components/productImage.vue';
  import noProduct from './components/noProduct.vue';

  const images: Ref<string[]> = ref([]);
  const notValidProduct = ref(false);

  const router = useRouter();

  let product: Ref<ProductFullInfo> = ref({}) as Ref<ProductFullInfo>;
  onMounted(async () => {
    const routerParams = router.currentRoute.value.params as routerParam;
    const productId = routerParams.id;
    try {
      product.value = (await findOneProduct(productId)).data.attributes;
    } catch {
      notValidProduct.value = true;
    }

    images.value.push(product.value.imagePath);
  });

  watch(
    () => router.currentRoute.value,
    async (to) => {
      if (/^\/products/.test(to.path)) {
        try {
          product.value = (await findOneProduct(to.params!.id)).data.attributes;
        } catch {
          notValidProduct.value = true;
        }
        images.value = [];
        images.value.push(product.value.imagePath);
      }
    },
  );

  const cartStore = useCartStore();

  //watch screen width to show different img element
  const screenWidth = ref(window.innerWidth);

  const isSmallScreen = computed(() => {
    return screenWidth.value <= 1000;
  });

  const handleResize = () => {
    screenWidth.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });
</script>

<style lang="less" scoped>
  .product-container {
    display: flex;
    margin: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    border-radius: 30px;
    padding: 20px 30px 50px;
    overflow: scroll;
    justify-content: space-evenly;
    min-width: 300px;

    .product-info {
      padding: 30px;

      > div {
        margin-bottom: 10px;
      }

      .product-price {
        margin-top: 30px;
        .label {
          font-size: 26px;
          font-weight: bold;
          color: #5433eb;
        }
        .number {
          font-size: 22px;
          font-weight: bold;
        }
      }

      .product-button {
        margin-bottom: 30px;
        button {
          height: 40px;
          width: 150px;
          font-size: 18px;
        }
        > div {
          height: 40px;
          width: 150px;
        }
      }

      .product-description {
        font-size: 16px;
        > h2 {
          margin-bottom: 10px;
        }
      }
    }
  }

  .carousel-container {
    min-width: 300px;
    margin: 0 20px 10px;
    img {
      width: 100%;
    }
  }

  @media screen and (max-width: 820px) {
    .product-container {
      flex-wrap: wrap;
      margin: 30px;
    }
  }
</style>
