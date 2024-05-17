<template>
  <el-dialog class="shop-dialog" v-model="changePasswordBox" id="changePassword" :fullscreen="isSmallScreen" :center="isSmallScreen">
    <div class="dialog-content">
      <div class="title">
        <h2>Change Password</h2>
      </div>
      <el-form
        class="shop-form"
        ref="changePasswordRef"
        :model="formData"
        label-position="left"
        :rules="rules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="Old password" prop="oldPassword">
          <el-input v-model="formData.oldPassword" autocomplete="off" placeholder="Your orgin password" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="formData.password" type="password" autocomplete="off" placeholder="Please input password" show-password />
        </el-form-item>
        <el-form-item label="Confirmed" prop="confirmedPassword">
          <el-input
            v-model="formData.confirmedPassword"
            type="password"
            autocomplete="off"
            placeholder="Please input password again"
            show-password
          />
        </el-form-item>
        <div class="dialog-footer">
          <!-- <el-button @click="changePasswordBox = false">Cancel</el-button> -->
          <el-button type="primary" @click="submitForm(changePasswordRef)"> Submit </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';
  import { PasswordChangeForm } from '@/store/modules/user/types';
  import { FormInstance, FormRules } from 'element-plus';

  const isSmallScreen = inject('isSmallScreen') as Ref<boolean>;

  const userStore = useUserStore();
  const changePasswordBox = inject('changePasswordBox') as Ref<boolean>;

  const changePasswordRef = ref<FormInstance>();
  const formData: PasswordChangeForm = reactive({
    oldPassword: '',
    password: '',
    confirmedPassword: '',
  });

  const validatePassword = (_rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('Please input the password again'));
    } else if (value !== formData.password) {
      callback(new Error("Two inputs don't match!"));
    } else {
      callback();
    }
  };

  const rules = reactive<FormRules<PasswordChangeForm>>({
    oldPassword: [
      {
        required: true,
        message: 'Please input password',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_\-+=]{6,20}$/,
        message: 'At least 6 characters, and contain one number and one letter.',
        trigger: 'blur',
      },
    ],
    confirmedPassword: [
      {
        validator: validatePassword,
        trigger: 'blur',
      },
    ],
  });

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        userStore.changePassword(formData);
      } else {
        console.log('error submit!', fields);
      }
    });
  };
</script>

<style lang="less" scoped></style>
