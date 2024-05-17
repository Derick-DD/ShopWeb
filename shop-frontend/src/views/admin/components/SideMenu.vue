<template>
  <el-menu :default-active="defaultActive" :router="true">
    <el-menu-item index="/admin" @click="closeMenu">
      <template #title>
        <span>Home</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/admin/categories" @click="closeMenu">
      <template #title>
        <span>Category</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/admin/products" @click="closeMenu">
      <template #title>
        <span>Product</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/admin/orders" @click="closeMenu">
      <template #title>
        <span>Order</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/" @click="closeMenu">
      <template #title>
        <span>Back To Shop</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
  const ifExpandMenu = inject('ifExpandMenu') as Ref<boolean>;
  function closeMenu() {
    ifExpandMenu.value = false;
  }

  const defaultActive = ref('/admin');
  const router = useRouter();
  onMounted(() => {
    defaultActive.value = router.currentRoute.value.path;
  });
</script>
<style scoped>
  .el-menu {
    min-height: 100dvh;
    --el-menu-hover-bg-color: #e9e5f8;
    --el-menu-active-color: #5433eb;
    border-right: none;
    .el-menu-item {
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
