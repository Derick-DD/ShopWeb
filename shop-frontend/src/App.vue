<template>
  <Header />
  <router-view />
  <el-backtop :right="100" :bottom="100" />
</template>
<script setup lang="ts">
  import Header from '@/components/Header/index.vue';

  //change elementplus base color
  onMounted(() => {
    document.body.style.setProperty('--el-color-primary', '#5433eb');
    document.body.style.setProperty('--el-color-primary-light-9', '#e9e5f8');
    document.body.style.setProperty('--el-color-primary-light-7', '#dad2f8');
    document.body.style.setProperty('--el-color-primary-light-3', '#8976de');
    document.body.style.setProperty('--el-text-color-regular', 'black');
  });
</script>

<style>
  html,
  body {
    height: 100%;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: var(--color-bg-1);
    height: 100%;
  }
</style>
