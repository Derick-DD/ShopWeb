<template>
  <el-dropdown @command="handleUserCommand">
    <el-avatar :src="userStore.avatar">
      <!-- This img tag is for error display -->
      <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
    </el-avatar>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="goToProfile">Profile</el-dropdown-item>
        <el-dropdown-item command="changePassword" divided>Change password</el-dropdown-item>
        <el-dropdown-item command="signOut" divided>Sign out</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <changePassword />
</template>

<script setup lang="ts">
  import { useCartStore, useUserStore } from '@/store';
  import changePassword from './changePassword.vue';
  import { ElMessage } from 'element-plus';

  const userStore = useUserStore();

  const changePasswordBox = ref(false);
  provide('changePasswordBox', changePasswordBox);

  const handleUserCommand = async (command: string) => {
    switch (command) {
      case 'signOut':
        const cartStore = useCartStore();
        await cartStore.saveCart();
        userStore.signOut();
        break;
      case 'goToProfile':
        ElMessage('profile');
        break;
      case 'changePassword':
        changePasswordBox.value = true;
        break;
      default:
        return;
    }
  };
</script>

<style lang="less" scoped>
  :focus-visible {
    outline: none;
  }
</style>
