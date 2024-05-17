<template>
  <div class="page-container">
    <div class="register-container">
      <h1 class="title">Create Your Account</h1>
      <div class="form-container">
        <el-form
          class="account-form"
          ref="createAccountRef"
          :model="formData"
          label-position="left"
          :rules="rules"
          :hide-required-asterisk="true"
        >
          <el-form-item label="Email" prop="email">
            <el-input v-model="formData.email" autocomplete="off" placeholder="example@example.com" :clearable="true" />
          </el-form-item>
          <ElDivider />
          <el-form-item label="Name" prop="username">
            <el-input v-model="formData.username" autocomplete="off" placeholder="Please input user name" :clearable="true" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              autocomplete="off"
              placeholder="Please input password"
              show-password
              :clearable="true"
            />
          </el-form-item>
          <el-form-item label="Confirmed Password" prop="confirmedPassword">
            <el-input
              v-model="formData.confirmedPassword"
              type="password"
              autocomplete="off"
              placeholder="Please input password again"
              show-password
              :clearable="true"
            />
          </el-form-item>
          <ElDivider />
          <div class="verification-form">
            <characterVerification ref="verifyCode" />
            <el-form-item prop="verificationCode">
              <el-input v-model="formData.verificationCode" autocomplete="off" placeholder="Type the characters in the image" />
            </el-form-item>
          </div>

          <ElDivider />
          <el-button type="primary" @click="submitForm(createAccountRef)"> Submit </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import characterVerification from '@/components/characterVerification.vue';
  import { CheckNameRes, CreateAccount } from '@/api/auth/types';
  import { checkName, signUp } from '@/api/auth';
  import { useUserStore } from '@/store';

  const createAccountRef = ref<FormInstance>();

  interface createAccountForm extends CreateAccount {
    confirmedPassword: string;
    verificationCode: string;
  }

  const formData: createAccountForm = reactive({
    email: '',
    username: '',
    password: '',
    confirmedPassword: '',
    verificationCode: '',
  });

  const userStore = useUserStore();
  onMounted(() => {
    if (userStore.googleInfo.google_id) {
      formData.email = userStore.googleInfo.google_email;
      formData.username = userStore.googleInfo.google_name;
    }
  });

  onBeforeUnmount(() => {
    userStore.googleInfo.google_id = '';
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

  // record the last input to stop meaningless request
  const lastInput = reactive({
    username: '',
    valid: false,
  });
  const validateUsername = async (_rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('Please input the username'));
    } else if (!/^[a-z0-9_.-]{3,17}$/.test(value)) {
      callback(new Error("Username can only contain lowercase letters, numbers, '_', '-' and '.' with min 3 max 17 length"));
    } else {
      if (value === lastInput.username) {
        if (lastInput.valid) {
          callback();
        } else {
          callback(new Error('Username has been used'));
        }
        return;
      }
      lastInput.username = value;
      const res: CheckNameRes = (await checkName({ username: value })).data.attributes;
      if (res.used) {
        lastInput.valid = false;
        callback(new Error('Username has been used'));
      } else {
        lastInput.valid = true;
        callback();
      }
    }
  };

  const verifyCode = ref({ validate: Function });

  const validateVerification = (_rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('Please input the verification code'));
    } else {
      if (verifyCode.value!.validate(value)) {
        callback();
      } else {
        callback(new Error('Verification code is wrong!'));
      }
    }
  };

  const rules = reactive<FormRules<createAccountForm>>({
    email: [
      {
        required: true,
        type: 'email',
        message: 'Please input a email',
        trigger: 'blur',
      },
    ],
    username: [
      {
        asyncValidator: validateUsername,
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_\-+=]{6,20}$/,
        message: 'Password should at least contain one number and one letter with min6 max 20 length, special characters are allowed.',
        trigger: 'blur',
      },
    ],
    confirmedPassword: [
      {
        validator: validatePassword,
        trigger: 'blur',
      },
    ],
    verificationCode: [
      {
        validator: validateVerification,
        trigger: 'blur',
      },
    ],
  });

  const router = useRouter();
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const createAccountData: CreateAccount = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        };
        if (userStore.googleInfo.google_id) {
          createAccountData.googleEmail = userStore.googleInfo.google_email;
          createAccountData.googleId = userStore.googleInfo.google_id;
        }
        console.log(createAccountData);
        try {
          await signUp(createAccountData);
        } catch (err) {
          ElMessage.error('Register failed, please try again');
          return;
        }
        router.push('/account/register_done');
      } else {
        console.log('error submit!', fields);
      }
    });
  };
</script>

<style lang="less" scoped>
  .page-container {
    width: 85%;
    margin: auto;
  }

  .register-container {
    width: 500px;
    margin: auto;
    .title {
      text-align: center;
      margin-bottom: 40px;
    }
    .verification-form {
      display: flex;
      .el-form-item {
        width: 100%;
      }
    }
    .el-button {
      width: 80%;
      margin-left: 10%;
      height: 40px;
      font-size: 18px;
    }
  }
</style>
