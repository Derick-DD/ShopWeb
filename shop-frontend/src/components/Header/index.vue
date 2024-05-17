<template>
  <div class="navbar" v-if="!ifAdmin">
    <div class="navbar-content">
      <router-link to="/"> <img class="logo" src="@/assets/images/homeLogo.svg" alt="" /></router-link>

      <div class="flex-grow"></div>
      <div id="sign-item" v-if="!userStore.ifSignIn">
        <signIn />
      </div>
      <div class="user-item" v-else>
        <Cart v-if="!/^\/order/.test(router.currentRoute.value.path)" />
        <profile />
      </div>
    </div>
  </div>
  <categoryList v-if="!ifAdmin" />
  <breadCrunmb />
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';
  import Cart from './cart.vue';
  import categoryList from './categoryList.vue';
  import signIn from './signIn.vue';
  import profile from './profile.vue';
  import breadCrunmb from './breadCrunmb.vue';

  // solve the component flash before ready problem
  const router = useRouter();
  const notMounted = ref(true);
  const ifAdmin = computed(() => {
    return notMounted.value || router.currentRoute.value.fullPath.startsWith('/admin');
  });

  const userStore = useUserStore();

  onMounted(() => {
    router.isReady().then(() => {
      notMounted.value = false;
    });
  });

  //watch screen width to show different img element
  const screenWidth = ref(window.innerWidth);

  const isSmallScreen = computed(() => {
    return screenWidth.value <= 600;
  });

  const handleResize = () => {
    screenWidth.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  provide('isSmallScreen', isSmallScreen);
</script>

<style lang="less" scoped>
  .navbar {
    min-height: 50px;
    min-width: auto;
    border-bottom: 1px solid #ccc;

    .navbar-content {
      margin: 0 10%;
      display: flex;
      align-items: center;

      .logo {
        width: 100px;
        min-width: 100px;
        cursor: pointer;
      }

      .flex-grow {
        flex-grow: 1;
      }

      .user-item {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
