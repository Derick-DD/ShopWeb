<template>
  <AdminHeader />
  <div class="admin-page">
    <div class="side-bar">
      <SideMenu />
    </div>
    <div class="main-page">
      <router-view />
    </div>
  </div>
  <el-drawer v-model="ifExpandMenu" direction="ltr" size="50%" :with-header="false">
    <SideMenu />
  </el-drawer>
</template>

<script setup lang="ts">
  import SideMenu from '@/views/admin/components/SideMenu.vue';
  import AdminHeader from '@/views/admin/components/AdminHeader.vue';

  const ifExpandMenu = ref(false);
  provide('ifExpandMenu', ifExpandMenu);
</script>
<style lang="less">
  .admin-page {
    display: flex;

    .side-bar {
      width: 20%;
      padding: 30px 10px;
    }
    .main-page {
      width: 80%;
    }
  }

  .menu-controll {
    display: none;
  }

  @media screen and (max-width: 1000px) {
    .admin-page {
      .side-bar {
        display: none;
      }
      .main-page {
        min-width: 100%;
      }
    }

    .menu-controll {
      display: block;
    }
  }
</style>
