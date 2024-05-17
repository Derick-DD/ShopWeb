<template>
  <el-container>
    <el-main>
      <el-button type="primary" round @click="goToCreate">Add a Product</el-button>
      <h3></h3>
      <productList />
    </el-main>
  </el-container>
</template>

<script setup>
  import productList from './components/productList.vue';

  const router = useRouter();

  function goToCreate() {
    console.log(router);
    router.push('/admin/products/create');
  }
</script>
<style scoped></style>
