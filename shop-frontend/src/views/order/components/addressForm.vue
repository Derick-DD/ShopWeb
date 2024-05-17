<template>
  <div class="address-form-container">
    <h2 class="colored-title">Add new address</h2>
    <div class="address-form">
      <el-form ref="createAddressRef" :model="formData" label-position="left" :rules="rules">
        <el-form-item label="Name" prop="name">
          <el-input v-model="formData.name" autocomplete="off" placeholder="Please input your name" :clearable="true" />
        </el-form-item>
        <el-form-item class="phone" label="Phone number" prop="phone">
          <el-input v-model="formData.phone" autocomplete="off" placeholder="Please input phone number">
            <template #prepend>
              <el-select v-model="phoneRegion">
                <el-option label="+86" value="86" />
                <el-option label="+852" value="852" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Address" prop="addressInfo">
          <el-select
            class="address-select"
            v-model="formData.addressInfo"
            filterable
            remote
            reserve-keyword
            value-key="id"
            :remote-method="searchAddress"
            placeholder="Please fill your address"
            :loading="ifLoading"
          >
            <el-option
              class="address-option"
              v-for="(addressItem, id) in searchedAddresses"
              :key="id"
              :value="{
                id: id,
                ...addressItem,
              }"
              :label="`${addressItem.addressName}, ${addressItem.address}`"
            >
              <div class="option-container">
                <div class="name">{{ addressItem.addressName }}</div>
                <div class="address">
                  {{ addressItem.address }}
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Detailed Address(Building & Unit)" prop="addressDetail">
          <el-input v-model="formData.addressDetail" autocomplete="off" placeholder="E.g. Block 1, 1F, 101" :clearable="true" />
        </el-form-item>
        <el-button type="primary" @click="submitForm(createAddressRef)"> Add </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { addAddress, searchHKAddress } from '@/api/order';
  import { useDebounceFn } from '@vueuse/core';
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import { AddressItem, UserAddress } from '@/api/order/types';

  const ifLoading = ref(false);
  const searchedAddresses: Ref<AddressItem[]> = ref([]);
  const searchAddress = useDebounceFn((query: string) => {
    searchedAddresses.value = [];
    if (!query) {
      return;
    }
    ifLoading.value = true;
    searchHKAddress(query).then((res) => {
      console.log(query);
      res.forEach((item: any) => {
        searchedAddresses.value.push({
          addressName: capitalizeFirstLetter(item.nameEN),
          address: capitalizeFirstLetter(item.addressEN),
          district: capitalizeFirstLetter(item.districtEN),
        });
      });
      ifLoading.value = false;
    });
  }, 1000);

  function capitalizeFirstLetter(str: string): string {
    const words = str.toLowerCase().split(' ');
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  }

  const phoneRegion: Ref<'86' | '852'> = ref('852');

  export interface UserAddressForm {
    addressInfo: AddressItem;
    addressDetail: string;
    name: string;
    phone: string;
  }
  const createAddressRef = ref<FormInstance>();
  const formData: UserAddressForm = reactive({
    name: '',
    phone: '',
    addressInfo: {
      addressName: '',
      address: '',
      district: '',
    },
    addressDetail: '',
  });

  const validateAddress = (_rule: any, value: any, callback: any) => {
    if (!formData.addressInfo.address && !formData.addressInfo.addressName) {
      callback(new Error('Please fill the address'));
    } else {
      callback();
    }
  };

  const validatePhone = (_rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('Please input your phone number'));
    } else {
      if (
        phoneRegion.value === '86' &&
        !/^1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/.test(value)
      ) {
        callback(new Error('Please input the correct mainland phone number'));
      } else if (phoneRegion.value === '852' && !/^([6|9])\d{7}$/.test(value)) {
        callback(new Error('Please input the correct HK phone number'));
      }

      callback();
    }
  };

  const rules = reactive<FormRules<UserAddressForm>>({
    name: [
      {
        required: true,
        message: 'Please input your name',
        trigger: 'blur',
      },
    ],
    phone: [
      {
        required: true,
        validator: validatePhone,
        trigger: 'blur',
      },
    ],
    addressInfo: [
      {
        required: true,
        validator: validateAddress,
        trigger: 'change',
      },
    ],
    addressDetail: [
      {
        required: true,
        message: 'Please input your address detail',
        trigger: 'blur',
      },
    ],
  });

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const submitAddress: UserAddress = {
          name: formData.name,
          phone: `${phoneRegion.value}-${formData.phone}`,
          addressName: formData.addressInfo.addressName,
          address: formData.addressInfo.address,
          district: formData.addressInfo.district,
          addressDetail: formData.addressDetail,
        };
        try {
          await addAddress(submitAddress);
          location.reload();
          ElMessage.success('Add address succeed');
        } catch (err) {
          console.log(err);
          ElMessage.error('Add address failed');
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };
</script>

<style lang="less" scoped>
  .el-select-dropdown__item {
    height: 50px;
    overflow: scroll;
    .option-container {
      padding: 5px 0;
      .name {
        font-size: 14px;
        line-height: 14px;
        font-weight: bold;
        color: black;
        margin-bottom: 10px;
      }
      .address {
        font-size: 12px;
        line-height: 12px;
        color: rgb(175, 172, 172);
      }
    }
  }

  .el-form-item {
    display: block !important;
  }

  .phone {
    .el-input-group__prepend {
      .el-select {
        width: 100px;
        :deep(.el-input__validateIcon) {
          display: none;
        }
      }
    }
    :deep(.el-form-item__error) {
      left: 100px;
    }
  }
</style>
