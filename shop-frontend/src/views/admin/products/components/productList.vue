<template>
  <el-scrollbar>
    <el-table :data="productsData">
      <el-table-column prop="id" label="PID" width="300" />
      <el-table-column prop="name" label="Name" width="150" />
      <!-- <el-table-column prop="category.name" label="Category" width="100" /> -->
      <el-table-column prop="price" label="Price" width="100" />
      <el-table-column prop="description" label="Description" width="300" />
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
  import { findAllProducts, removeProduct } from '@/api/product';
  import { ProductInfo } from '@/api/product/types';

  const productsData: Ref<ProductInfo[]> = ref([]);

  const fetchData = async () => {
    const res = await findAllProducts();
    productsData.value = res.data.attributes;
  };

  onMounted(() => {
    fetchData();
  });

  const router = useRouter();

  function handleClick(row) {
    const id = row.id;
    router.push(`/admin/products/${id}`);
  }

  const handleDelete = async (row) => {
    ElMessageBox.confirm('Are you sure you want to delete?', 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }).then(async () => {
      try {
        await removeProduct(row.id);
      } catch (error) {
        ElMessage.error(error.response.data.message);
        return false;
      }

      const index = productsData.value.findIndex((item) => item.id === row.id);

      // Remove the row from tableData
      if (index !== -1) {
        productsData.value.splice(index, 1);
      }
      ElMessage.success('It is deleted');
    });
  };
</script>
<style scoped></style>
