/**
 * @name  AutoRegistryComponents
 */

import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver, AntDesignVueResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export const AutoRegistryComponents = () => {
  return Components({
    dirs: ['src/components'],
    extensions: ['vue', 'md'],
    deep: true,
    dts: 'types/components.d.ts',
    directoryAsNamespace: false,
    globalNamespaces: [],
    directives: true,
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    resolvers: [ElementPlusResolver(), AntDesignVueResolver({ resolveIcons: true }), NaiveUiResolver()],
  });
};
