<template>
  <div class="page-container flex-container">
    <h1>Your account has been recovered!</h1>
    <p class="info">
      The <strong>SignIn window</strong> will be opened in <strong>{{ count }}</strong> seconds</p
    >
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';

  const count = ref(5);
  const router = useRouter();
  onMounted(() => {
    setInterval(async () => {
      count.value--;
      if (count.value === 0) {
        clearInterval(count.value);
        await router.push('/');
        const userStore = useUserStore();
        userStore.popSignIn();
      }
    }, 1000);
  });
</script>

<style lang="less" scoped>
  .flex-container {
    flex-direction: column;

    h1,
    strong {
      color: #5433eb;
    }

    .info {
      margin-top: 30px;
      font-size: 18px;
      text-align: center;
    }
  }
</style>
