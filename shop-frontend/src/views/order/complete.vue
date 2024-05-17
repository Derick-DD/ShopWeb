<template>
  <div class="page-container flex-container" v-loading="loading">
    <div class="info-card">
      <div class="success-info" v-show="orderSuccess">
        <div class="title">
          <el-icon><CircleCheck /></el-icon>
          <span>Payment Success</span>
        </div>
        <div class="order-info">
          <div class="order-id"> <span class="label">Order ID:</span> {{ paymentInfo.orderId }} </div>
          <div class="order-amount"
            ><span class="label">Total Amout:</span> {{ paymentInfo.amount.currency }} {{ paymentInfo.amount.value }}</div
          >
          <div class="payee"><span class="label">Merchant: </span>{{ paymentInfo.payee }}</div>
          <div class="payer"><span class="label">Payment Time:</span> {{ paymentInfo.paytime }}</div>
        </div>
      </div>
      <div class="failed-info" v-show="orderFailed">
        <h3>Acquire Order information failed, please try again later</h3>
        <router-link to="/order/cart"> click here to back to cart </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus';
  import { completePaypalOrder } from '@/api/order';
  import { convertTime } from '@/utils/date';

  const loading = ref(false);
  const router = useRouter();
  const orderFailed = ref(false);
  const orderSuccess = ref(false);
  const paymentInfo = ref({
    orderId: '',
    amount: {
      currency: '',
      value: '',
    },
    payee: '',
    paytime: '',
  });

  onMounted(async () => {
    if (!router.currentRoute.value.query.orderId) {
      // router.push('/');
      ElMessage.warning('Order does not exist');
    } else {
      try {
        const res = (await completePaypalOrder(router.currentRoute.value.query.orderId as string)).data.attributes;
        console.log(res);
        paymentInfo.value = {
          ...res,
        };
        paymentInfo.value.paytime = convertTime(res.paytime);
        paymentInfo.value.orderId = res.orderId ? res.orderId : router.currentRoute.value.query.orderId;
        orderSuccess.value = true;
        loading.value = false;
      } catch {
        loading.value = false;
        orderFailed.value = true;
      }
    }
  });
</script>

<style lang="less" scoped>
  .flex-container {
    justify-content: center;
    .info-card {
      width: 90%;
      max-width: 800px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      overflow: scroll;

      .success-info {
        .title {
          color: #67c23a;
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 20px;
          .el-icon {
            top: 5px;
            margin-right: 20px;
          }
        }
        .order-info {
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          width: 100%;
          border-radius: 10px;
          padding: 20px;
          font-size: 16px;
          display: table;
          border-collapse: separate;
          border-spacing: 0 10px;

          > div {
            display: table-row;

            .label {
              font-weight: bold;
              min-width: 150px;
              display: table-cell;
            }
          }
        }
      }

      .failed-info {
        h3 {
          color: red;
          margin-bottom: 20px;
        }
        a {
          font-weight: 500;
          text-decoration: underline;
        }
      }
    }
  }
</style>
