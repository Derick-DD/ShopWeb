<template>
  <el-container>
    <el-main>
      <el-button type="primary" round @click="goToCreate">Add a Category</el-button>
      <h3></h3>
      <categoryList />
    </el-main>
  </el-container>
</template>

<script setup>
  import categoryList from './components/categoryList.vue';

  const router = useRouter();

  function goToCreate() {
    router.push('/admin/categories/create');
  }
</script>
<style scoped></style>
