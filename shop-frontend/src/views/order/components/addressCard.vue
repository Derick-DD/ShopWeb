<template>
  <h2 class="colored-title"
    ><el-icon><Location /></el-icon> Deliver To
  </h2>
  <div class="address-container" v-if="checkoutInfo.addressInfo">
    <div class="address-info">
      <div class="address">
        <div class="main-address">{{ checkoutInfo.addressInfo.addressDetail }}, {{ checkoutInfo.addressInfo.address }}</div>
      </div>
      <div class="contact">
        <span class="name">{{ checkoutInfo.addressInfo.name }}</span>
        <span class="phone"> {{ checkoutInfo.addressInfo.phone }} </span>
      </div>
    </div>
    <div class="address-operation">
      <el-button type="primary" @click="viewDrawer = true">change</el-button>
    </div>
  </div>
  <div class="no-address" v-else>
    <el-button @click="addDrawer = true" type="primary"> You have no address, add one now ! </el-button>
  </div>

  <el-drawer class="address-drawer" v-model="addDrawer" title="Address" direction="rtl">
    <address-form />
  </el-drawer>
  <el-drawer class="address-drawer" v-model="viewDrawer" title="Address" direction="rtl">
    <address-drawer :addresses="addresses" />
  </el-drawer>
</template>

<script setup lang="ts">
  import { getAddress } from '@/api/order';
  import addressForm, { UserAddressForm } from './addressForm.vue';
  import addressDrawer from './addressDrawer.vue';
  import { UserAddressRes } from '@/api/order/types';
  import { CheckoutInfo } from '../cart.vue';

  const viewDrawer = ref(false);
  const addDrawer = ref(false);

  const addresses: Ref<UserAddressRes[]> = ref([]);

  const checkoutInfo = inject('checkoutInfo') as CheckoutInfo;
  onMounted(async () => {
    addresses.value = (await getAddress()).data.attributes;
    if (addresses.value.length > 0) {
      checkoutInfo.addressInfo = {
        ...addresses.value[0],
      };
    }
  });

  const addressFormData: Ref<UserAddressForm | null> = ref(null);

  provide('addressForm', addressFormData);
</script>

<style lang="less" scoped>
  .el-icon {
    top: 3px;
  }

  .address-container {
    display: flex;
    justify-content: space-between;
    .address {
      margin-bottom: 20px;
      .main-address {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .detail-address {
        font-size: 14px;
      }
    }
    .contact {
      font-size: 16px;
      font-weight: 500;
      .name {
        margin-right: 10px;
      }
    }
  }

  .no-address {
    display: flex;
    justify-content: center;
    .el-button {
      font-size: 16px;
      font-weight: bold;
      padding: 20px;
      max-width: 100%;
      overflow: scroll;
    }
  }
</style>

<style lang="less">
  .address-drawer {
    width: 30% !important;
    .el-drawer__header {
      color: #5433eb;
      padding-bottom: 20px;
      border-bottom: 1px rgb(220, 216, 216) solid;
      .el-drawer__title {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .address-drawer {
      width: 50% !important;
    }
  }

  @media screen and (max-width: 500px) {
    .address-drawer {
      width: 100% !important;
    }
  }
</style>
