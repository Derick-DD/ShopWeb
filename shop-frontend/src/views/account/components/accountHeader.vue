<template>
  <div class="account-header">
    <el-steps style="width: 600px" :active="2" align-center>
      <el-step title="Step 1" />
      <el-step title="Step 2" />
      <el-step title="Step 3" />
    </el-steps>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .account-header {
    margin: 30px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
