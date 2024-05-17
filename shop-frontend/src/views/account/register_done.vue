<template>
  <div class="page-container flex-container">
    <h1>Welcome To ShopXX</h1>
    <h2>A verification email has been sent to your email</h2>
    <p class="info"> You can sign in <strong>after finish the verification</strong> </p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .flex-container {
    flex-direction: column;

    h1,
    strong {
      color: #5433eb;
    }

    h2 {
      margin-top: 20px;
    }

    .info {
      margin-top: 30px;
      font-size: 18px;
      text-align: center;
    }
  }
</style>
