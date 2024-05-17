<template>
  <div class="header">
    <h2 class="colored-title">My Address</h2>
    <el-button type="primary" @click="addDrawer = true"> Add One </el-button>
  </div>
  <div class="address-container">
    <div class="address-items" v-if="addresses.length > 0">
      <el-radio-group v-model="selectedAddress">
        <el-radio v-for="(addressItem, id) in addresses" :key="addressItem.id" :value="id" border>
          <div class="address-info">
            <div class="address">
              <div class="main-address"
                ><el-text truncated>{{ addressItem.addressDetail }}, {{ addressItem.address }}</el-text></div
              >
            </div>
            <div class="contact">
              <span class="name">{{ addressItem.name }}</span>
              <span class="phone"> {{ addressItem.phone }} </span>
            </div>
          </div>
          <div class="address-operation">
            <!-- <el-button type="primary" size="small">Edit</el-button>
            <el-button type="primary" size="small">Delete</el-button> -->
          </div>
        </el-radio>
      </el-radio-group>
    </div>
    <div class="no-address" v-else><h2 class="colored-title">You have no address</h2></div>
  </div>
  <el-drawer class="address-drawer" v-model="addDrawer" title="Address" direction="rtl">
    <address-form />
  </el-drawer>
</template>

<script setup lang="ts">
  import { UserAddressRes } from '@/api/order/types';
  import { CheckoutInfo } from '../cart.vue';
  import addressForm from './addressForm.vue';

  const addDrawer = ref(false);

  const props = defineProps({
    addresses: {
      type: Array as () => UserAddressRes[],
      required: true,
      default: () => [],
    },
  });

  const selectedAddress: Ref<number> = ref(0);

  const checkoutInfo = inject('checkoutInfo') as CheckoutInfo;
  onMounted(() => {
    if (props.addresses.length > 0) {
      checkoutInfo.addressInfo = {
        ...props.addresses[selectedAddress.value],
      };
    }
  });

  watch(
    () => selectedAddress.value,
    () => {
      if (props.addresses.length > 0) {
        checkoutInfo.addressInfo = {
          ...props.addresses[selectedAddress.value],
        };
      }
    },
  );
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    .colored-title {
      min-width: 120px;
    }
  }

  .address-items {
    .el-radio-group {
      width: 100%;
      .el-radio {
        height: 100px;
        padding: 10px;
        display: flex;
        overflow: scroll;
        .address {
          .main-address {
            :deep(.el-text) {
              font-size: 14px;
              margin-bottom: 5px;
            }
          }
        }
        .contact {
          font-size: 14px;
          font-weight: 500;
          color: black;
          .name {
            margin-right: 10px;
          }
        }
        .address-operation {
          padding: 0;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>

<style lang="less">
  .el-radio__label {
    width: 90%;
  }
</style>
