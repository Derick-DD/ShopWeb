<template>
  <GoogleLogin :callback="callback" prompt />
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';
  import { decodeCredential, type CallbackTypes } from 'vue3-google-login';

  const callback: CallbackTypes.CredentialCallback = async (response) => {
    console.log(response);
    const userInfo: any = decodeCredential(response.credential);
    console.log(userInfo);
    const userStore = useUserStore();
    userStore.googleInfo = {
      google_id: userInfo.sub,
      google_email: userInfo.email,
      google_name: userInfo.name,
    };
    await userStore.googleSign(response.credential);
  };
</script>

<style lang="less" scoped></style>
