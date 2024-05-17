/**
 * @name AutoImportDeps
 */

import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { VueRouterAutoImports } from 'unplugin-vue-router';

export const AutoImportDeps = () => {
  return AutoImport({
    dts: 'types/auto-imports.d.ts',
    imports: [
      'vue',
      'pinia',
      {
        '@vueuse/core': [],
      },
      VueRouterAutoImports,
    ],
    resolvers: [AntDesignVueResolver()],
  });
};
