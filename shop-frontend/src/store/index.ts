import { createPinia } from 'pinia';
import { useUserStore } from './modules/user';
import { useCartStore } from './modules/cart';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export { useUserStore, useCartStore };
export default pinia;
