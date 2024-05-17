<template>
  <div class="success page-container flex-container" v-if="ifSuccess">
    <h1>Your Account Has Been Verified!</h1>
    <h2>Welcome To ShopXX</h2>
    <p class="info"> You can <strong>sign in now</strong> by clicking the <strong>SignIn button</strong> on the top of the page. </p>
  </div>
  <div class="failed page-container flex-container" v-else>
    <h1>Verification Failed!</h1>
    <p class="info">Your verification data might be wrong or expired</p>
  </div>
</template>

<script setup lang="ts">
  import { verifyAccount } from '@/api/auth';
  import { ElMessage } from 'element-plus';

  const ifSuccess: Ref<null | boolean> = ref(null);
  const router = useRouter();
  onMounted(async () => {
    const routerQueries = router.currentRoute.value.query as { token: string };
    if (!routerQueries.token) {
      ifSuccess.value = false;
      ElMessage.warning('There is no token');
      return;
    }
    try {
      await verifyAccount(routerQueries.token);
      ifSuccess.value = true;
    } catch (err) {
      ifSuccess.value = false;
    }
  });
</script>

<style lang="less" scoped>
  .flex-container {
    flex-direction: column;

    h1,
    h2,
    strong {
      color: #5433eb;
    }

    h2 {
      margin-top: 10px;
    }

    .info {
      margin-top: 20px;
      font-size: 18px;
      text-align: center;
    }
  }
</style>
