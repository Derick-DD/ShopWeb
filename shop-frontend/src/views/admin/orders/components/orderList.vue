<template>
  <el-scrollbar>
    <el-table :data="ordersData">
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <h3 class="colored-title">Products</h3>
            <el-table :data="props.row.items">
              <el-table-column label="PID" prop="productId" />
              <el-table-column label="Name" prop="name" />
              <el-table-column label="Single Price" prop="price" />
              <el-table-column label="Count" prop="count" />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="OID" width="300" />
      <el-table-column prop="user" label="Username" width="150" />
      <!-- <el-table-column prop="category.name" label="Category" width="100" /> -->
      <el-table-column prop="total" label="Price" width="100" />
      <el-table-column prop="status" label="Status" width="300" />
      <el-table-column prop="created_at" label="Create Time" width="300" />
      <!-- <el-table-column label="Operations" width="150">
        <template #default="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">Edit</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">delete</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </el-scrollbar>
</template>

<script setup lang="ts">
  import { getAllOrdersRecord } from '@/api/order';
  import { OrderFullRes } from '@/api/order/types';
  import { convertTime } from '@/utils/date';
  import { checkOrderStatus } from '@/utils/orderStatus';

  const ordersData: Ref<OrderFullRes[]> = ref([]);

  const fetchData = async () => {
    const res = await getAllOrdersRecord();
    ordersData.value = res.data.attributes;
  };

  onMounted(async () => {
    await fetchData();
    ordersData.value.forEach((orderItem) => {
      orderItem['status'] = checkOrderStatus(orderItem);
      orderItem.created_at = convertTime(orderItem.created_at);
    });
  });
</script>
<style scoped></style>
