<template>
  <el-breadcrumb separator="/" v-show="breadCrumbContent.path">
    <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
    <el-breadcrumb-item v-show="breadCrumbContent.id">{{ breadCrumbContent.name }} </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
  import { routerParam } from '@/router/types';
  import { RouteLocationNormalizedLoadedTyped } from 'unplugin-vue-router';

  // export interface BreadCrumbContent {
  //   category: {
  //     id: string;
  //     name: string;
  //   };
  //   product: {
  //     id: string;
  //     name: string;
  //   };
  // }
  // const breadCrumbContent: BreadCrumbContent = reactive({
  //   category: {
  //     id: '',
  //     name: '',
  //   },
  //   product: {
  //     id: '',
  //     name: '',
  //   },
  // });
  const breadCrumbContent = reactive({
    id: '',
    name: '',
    path: '',
  });
  const router = useRouter();
  watch(
    () => router.currentRoute.value,
    async (to) => {
      changeBreadCrumb(to);
    },
  );

  onMounted(async () => {
    changeBreadCrumb(router.currentRoute.value);
  });

  function changeBreadCrumb(routerValue: RouteLocationNormalizedLoadedTyped<any>): void {
    const params = routerValue.params as routerParam;
    const path = routerValue.path;
    breadCrumbContent.id = params.id;
    breadCrumbContent.name = params.name;
    if (/^\/products/.test(path)) {
      breadCrumbContent.path = 'products';
      return;
    }
    if (/^\/category/.test(path)) {
      breadCrumbContent.path = 'category';
      return;
    }
    breadCrumbContent.path = '';
  }
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin: 20px 0 0 20px;
    font-size: 16px;
  }
</style>
