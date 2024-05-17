<template>
  <div class="navbar">
    <div class="navbar-content">
      <div class="menu-controll" @click="ifExpandMenu = true">
        <el-icon><Expand /></el-icon>
        <span>Menu</span>
      </div>
      <div class="flex-grow"></div>
      <router-link to="/admin"> <img class="logo" src="@/assets/images/homeLogo.svg" alt="" /></router-link>

      <div class="flex-grow"></div>
      <div class="user-item"><profile /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import profile from '@/components/Header/profile.vue';

  const ifExpandMenu = inject('ifExpandMenu');
</script>

<style lang="less" scoped>
  .navbar {
    min-height: 50px;
    min-width: auto;
    border-bottom: 1px solid #ccc;

    .navbar-content {
      margin: 0 10%;
      display: flex;
      align-items: center;

      .menu-controll {
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        .el-icon {
          text-align: center;
          vertical-align: middle;
          padding-bottom: 5px;
          margin-right: 5px;
        }
      }

      .logo {
        height: 50px;
        min-width: 100px;
        cursor: pointer;
      }

      .flex-grow {
        flex-grow: 1;
      }
    }
  }
</style>
