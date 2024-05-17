import { OrderFullRes, OrderRes } from '@/api/order/types';

export function checkOrderStatus(order: OrderRes | OrderFullRes) {
  if (order.pend) {
    return 'Waiting for Payment';
  } else if (order.toRefund) {
    return 'Waiting for Refund';
  } else if (order.ifRefund) {
    return 'Refunded';
  } else {
    return 'Completed';
  }
}
