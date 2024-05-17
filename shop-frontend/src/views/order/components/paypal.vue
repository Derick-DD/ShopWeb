<template>
  <div id="paypalDom" ref="paypalRef"></div>
</template>

<script setup lang="ts">
  import { cancelPaypalOrder, createPaypalOrder } from '@/api/order';
  import { OrderInfo } from '@/api/order/types';
  import { useCartStore } from '@/store';
  import loadJs from '@/utils/loadJs';
  import { ElMessage } from 'element-plus';

  const paypalRef = ref(null);
  const orderInfo = inject('orderInfo') as OrderInfo;
  const router = useRouter();
  onMounted(async () => {
    const paypalJs = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&components=buttons&currency=HKD`;
    await loadJs(paypalJs);
    window.paypal
      .Buttons({
        style: {
          layout: 'vertical',
          shape: 'rect',
          label: 'paypal',
        },
        async createOrder() {
          const cartStore = useCartStore();
          const orderId = createPaypalOrder(orderInfo).then((response) => response.data.attributes.orderId);
          await cartStore.getCarts(true);
          return orderId;
        },
        async onApprove(data) {
          // const res = (await completePaypalOrder(data.orderID)).data.attributes;
          router.push({
            path: '/order/complete',
            query: {
              orderId: data.orderID,
            },
          });
        },
        async onCancel(data) {
          await cancelPaypalOrder(data.orderID);
          ElMessage('Your order has been canceled');
          router.push({
            path: '/order/cart',
          });
        },
        async onError(err) {
          ElMessage.error(err);
        },
      })
      .render(paypalRef.value);
  });

  declare global {
    interface Window {
      paypal: any;
    }
  }
</script>

<style lang="less" scoped></style>
