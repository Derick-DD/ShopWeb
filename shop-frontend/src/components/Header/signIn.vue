<template>
  <div class="sign-button"><el-button @click="userStore.popSignIn()" link> SignIn </el-button></div>
  <el-dialog class="shop-dialog" v-model="signBoxStatus" :fullscreen="isSmallScreen" :align-center="isSmallScreen">
    <div class="dialog-content">
      <div class="title">
        <h2>Sign In</h2>
      </div>
      <el-form class="shop-form" ref="signInRef" :model="formData" label-position="left" :rules="rules" :hide-required-asterisk="true">
        <el-form-item label="email" prop="email">
          <el-input v-model="formData.email" autocomplete="off" placeholder="example@example.com" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="formData.password" type="password" autocomplete="off" placeholder="Please input" show-password />
        </el-form-item>
        <el-form-item class="flex-item" label="Remember Me">
          <el-switch v-model="formData.rememberMe" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm(signInRef)"> Sign </el-button>
          <div class="google">
            <googleButton />
          </div>
          <div class="sign-link">
            <router-link to="/account/forget_password">
              Forget password?
              <el-icon><TopRight /></el-icon>
            </router-link>
          </div>
          <div class="sign-link">
            Don't have an account?
            <router-link to="/account/register">
              Register Now!
              <el-icon><TopRight /></el-icon>
            </router-link>
          </div>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';
  import { SignInForm } from '@/store/modules/user/types';
  import { FormInstance, FormRules } from 'element-plus';
  import googleButton from '../googleButton.vue';

  const isSmallScreen = inject('isSmallScreen') as Ref<boolean>;

  const userStore = useUserStore();
  const { signBoxStatus } = storeToRefs(userStore);

  const signInRef = ref<FormInstance>();
  const formData: SignInForm = reactive({
    email: '',
    password: '',
    rememberMe: false,
  });

  const rules = reactive<FormRules<SignInForm>>({
    email: [
      {
        type: 'email',
        required: true,
        message: 'Please input email',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: 'Please input password',
        trigger: 'blur',
      },
    ],
  });

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        userStore.signIn(formData);
      } else {
        console.log('error submit!', fields);
      }
    });
  };
</script>

<style lang="less" scoped>
  .sign-button {
    min-width: 50px;
    padding: 0 20px;

    .el-button {
      font-size: larger;
      color: black;
      --el-button-hover-link-text-color: #5a44c0;
    }
  }

  .sign-link {
    text-align: center;
    margin-top: 15px;

    a {
      color: #5a44c0;

      .el-icon {
        top: 3px;
      }
    }

    a:hover {
      text-decoration: underline;
    }
  }

  .google {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>
