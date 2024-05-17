/**
 * @name createVitePlugins
 * @description pack plugins
 */
import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VitePluginCertificate from 'vite-plugin-mkcert';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import { AutoRegistryComponents } from './component';
import { AutoImportDeps } from './autoImport';
import { ConfigPagesPlugin } from './pages';
import { ConfigRestartPlugin } from './restart';
import { ConfigProgressPlugin } from './progress';

export function createVitePlugins() {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // auto router
    ConfigPagesPlugin(),
    // vue
    vue(),
    // JSX
    vueJsx(),
    // setup
    vueSetupExtend(),
    // https
    VitePluginCertificate({
      source: 'coding',
    }),
  ];

  // auto import
  vitePlugins.push(AutoRegistryComponents());
  vitePlugins.push(AutoImportDeps());

  // restart for config
  vitePlugins.push(ConfigRestartPlugin());

  // progress display
  vitePlugins.push(ConfigProgressPlugin());

  return vitePlugins;
}
