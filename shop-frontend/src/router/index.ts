import { createRouter, createWebHistory } from 'vue-router/auto';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useUserStore } from '@/store';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(),
});

//pages dont need auth
const whiteAddressList = ['/'];
const whiteRegexList = [/^\/products/, /^\/category/, /^\/account/];

router.beforeEach(async (_to, _from, next) => {
  NProgress.start();

  //permission check
  const userStore = useUserStore();
  const { ifSignIn, checkRole } = storeToRefs(userStore);
  if (ifSignIn.value) {
    //check if allow admin
    if (/^\/admin/.test(_to.path)) {
      if (checkRole.value('admin')) {
        next();
      } else {
        ElMessage.warning('Access denied');
        next('/');
      }
    } else {
      next();
    }
  } else {
    if (whiteAddressList.includes(_to.path) || whiteRegexList.some((regex) => regex.test(_to.path))) {
      next();
    } else {
      ElMessage.warning('Please sign in');
      setTimeout(() => {
        userStore.popSignIn();
      }, 1000);
      next(_from.path);
    }
  }
});

router.afterEach((_to) => {
  const userStore = useUserStore();
  userStore.closeSignIn();
  NProgress.done();
});

export default router;
