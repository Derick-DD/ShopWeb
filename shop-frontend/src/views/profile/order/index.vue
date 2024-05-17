<template>
  <div> {{ test }} </div>
</template>

<script setup lang="ts">
  import { getOrdersRecord } from '@/api/order';

  const test = ref();
  onMounted(async () => {
    test.value = (await getOrdersRecord()).data.attributes;
  });
</script>

<style lang="less" scoped></style>
