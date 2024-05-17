<template>
  <div class="category-box">
    <el-scrollbar>
      <el-menu
        :key="refreshKey"
        :default-active="activeIndex"
        active-text-color="#5433eb"
        class="el-menu"
        mode="horizontal"
        :ellipsis="false"
      >
        <div class="flex-grow"></div>
        <el-menu-item v-for="category in categories" :index="category.id" :key="category.id">
          <router-link class="item-content" :to="`/category/${category.name}_${category.id}`">
            {{ category.name }}
          </router-link>
        </el-menu-item>
        <div class="flex-grow"></div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { findAllCategoris } from '@/api/category';
  import { CategoryInfo } from '@/api/category/types';
  import { routerParam } from '@/router/types';

  const activeIndex = ref('');
  const router = useRouter();
  const params = router.currentRoute.value.params as routerParam;
  const currentId = params.id;

  const categories: Ref<CategoryInfo[]> = ref([]);

  const fetchData = async () => {
    const res = await findAllCategoris();
    categories.value = res.data.attributes;
  };

  onMounted(() => {
    if (currentId) {
      activeIndex.value = currentId;
    }
    fetchData();
  });

  //refresh the menu to delete active if this is not a category page
  const refreshKey = ref(0);
  watch(
    () => router.currentRoute.value,
    async (to) => {
      const toParams = to.params as routerParam;
      if (!toParams.id) {
        activeIndex.value = '';
        refreshKey.value++;
      }
    },
  );
</script>

<style scoped>
  .category-box {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  .el-menu {
    border: none !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    .flex-grow {
      flex-grow: 1;
    }

    .el-menu-item {
      font-size: 15px !important;
      font-weight: bold;
      background-color: white !important;
      padding: 0;

      .item-content {
        padding: 0 10px;
      }

      &:hover {
        color: #5433eb !important;
      }
    }
  }
</style>
