<template>
  <div class="page-container">
    <div class="register-container">
      <h1 class="title">Recover Your Account</h1>
      <div class="form-container">
        <el-form
          class="account-form"
          ref="recoverAccountRef"
          :model="formData"
          label-position="left"
          :rules="rules"
          :hide-required-asterisk="true"
        >
          <el-form-item label="Email" prop="email">
            <el-input v-model="formData.email" autocomplete="off" placeholder="example@example.com" :clearable="true" />
          </el-form-item>
          <el-form-item label="Recovery Key" prop="recoveryKey">
            <el-input
              v-model="formData.recoveryKey"
              autocomplete="off"
              placeholder="Please input the key sent to your email"
              :clearable="true"
            >
              <template #append>
                <el-button type="primary" @click="sendCode" :disabled="ifSend" :loading="ifSending">{{
                  timer === 0 ? 'Send Key' : `${timer}s`
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <ElDivider />
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
          <el-button type="primary" @click="submitForm(recoverAccountRef)"> Submit </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import characterVerification from '@/components/characterVerification.vue';
  import { RecoverAccount } from '@/api/auth/types';
  import { generateRecoveryKey, recoverAccount } from '@/api/auth';
  import { useIntervalFn } from '@vueuse/core';

  //send one recovery key in 60s
  const timer = ref(0);
  const ifSend = ref(false);
  const ifSending = ref(false);

  const { pause, resume } = useIntervalFn(
    () => {
      if (timer.value <= 0) {
        pause();
        timer.value = 0;
        ifSend.value = false;
      } else {
        timer.value -= 1;
      }
    },
    1000,
    { immediate: false, immediateCallback: false },
  );

  const sendCode = async () => {
    if (timer.value === 0) {
      await recoverAccountRef.value!.validateField('email', async (valid) => {
        if (valid) {
          ifSending.value = true;
          try {
            await generateRecoveryKey({ email: formData.email });
          } catch (err) {
            ElMessage.error('Can not send key, check your email');
            ifSending.value = false;
            return;
          }
          timer.value = 60;
          ifSend.value = true;
          ifSending.value = false;
          resume();
        }
      });
    } else {
      return;
    }
  };

  const recoverAccountRef = ref<FormInstance>();

  interface recoverAccountForm extends RecoverAccount {
    confirmedPassword: string;
    verificationCode: string;
  }

  const formData: recoverAccountForm = reactive({
    email: '',
    recoveryKey: '',
    password: '',
    confirmedPassword: '',
    verificationCode: '',
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

  const rules = reactive<FormRules<recoverAccountForm>>({
    email: [
      {
        required: true,
        type: 'email',
        message: 'Please input a email',
        trigger: 'blur',
      },
    ],
    recoveryKey: [
      {
        required: true,
        message: 'Please input recovery key',
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
        const recoverAccountData: RecoverAccount = {
          email: formData.email,
          recoveryKey: formData.recoveryKey,
          password: formData.password,
        };
        try {
          await recoverAccount(recoverAccountData);
        } catch (err) {
          ElMessage.error('Recovery failed, please try again');
          return;
        }
        router.push('/account/recover_done');
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

  :deep(.el-input-group__append) {
    padding: 0 !important;
    border: none;
    width: 150px;
    .el-button {
      width: 100%;
      margin: 0;
      color: white;
      background-color: #5433eb;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .el-button:not(.is-disabled):hover {
      color: white;
      background-color: #8976de;
    }

    .is-disabled:hover {
      color: white !important;
      background-color: #5433eb !important;
    }
  }
</style>
