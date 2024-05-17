import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import piniaStore from './store';

import '@/assets/styles/index.less';
import '@/assets/styles/reset.less';

// element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import vue3GoogleLogin from 'vue3-google-login';

//vue3的挂载方式
const app = createApp(App);

app.use(router);
app.use(piniaStore);

app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

app.mount('#app');
