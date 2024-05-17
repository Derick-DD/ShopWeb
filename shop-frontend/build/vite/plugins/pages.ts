/**
 * @name ConfigPagesPlugin
 * @description auto router
 */
import VueRouter from 'unplugin-vue-router/vite';

export const ConfigPagesPlugin = () => {
  return VueRouter({
    routesFolder: ['src/views'],
    dts: 'types/typed-router.d.ts',
    dataFetching: true,
    exclude: ['**/components/*.vue'],
    extensions: ['.vue'],
  });
};
