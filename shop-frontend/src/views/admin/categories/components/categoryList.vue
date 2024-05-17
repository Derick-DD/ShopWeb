<template>
  <el-scrollbar>
    <el-table :data="categoriesData">
      <el-table-column prop="id" label="PID" width="300" />
      <el-table-column prop="name" label="Name" />
      <el-table-column label="Operations" width="150">
        <template #default="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">Edit</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script setup lang="ts">
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { findAllCategoris, removeCategory } from '@/api/category';
  import { CategoryInfo } from '@/api/category/types';

  const categoriesData: Ref<CategoryInfo[]> = ref([]);

  const fetchData = async () => {
    const res = await findAllCategoris();
    categoriesData.value = res.data.attributes;
  };

  onMounted(() => {
    fetchData();
  });

  const router = useRouter();

  function handleClick(row) {
    const id = row.id;
    const name = row.name;
    router.push(`/admin/categories/${name}_${id}`);
  }

  const handleDelete = async (row) => {
    ElMessageBox.confirm('Are you sure you want to delete?', 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }).then(async () => {
      try {
        await removeCategory(row.id);
      } catch (error) {
        ElMessage.error(error.response.data.message);
        return false;
      }

      const index = categoriesData.value.findIndex((item) => item.id === row.id);

      // Remove the row from categoriesData
      if (index !== -1) {
        categoriesData.value.splice(index, 1);
      }
      ElMessage.success('It is deleted');
    });
  };
</script>
<style scoped></style>
