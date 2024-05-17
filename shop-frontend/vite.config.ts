import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import { createVitePlugins } from './build/vite/plugins';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      },
    },

    // server
    server: {
      hmr: { overlay: false },
      port: Number(env.VITE_APP_PORT),
      host: '0.0.0.0',
      cors: false,
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_API_TARGET_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL}`), ''),
        },
        //HKaddressAPI
        ['/addressData']: {
          target: 'https://geodata.gov.hk/gs/api/v1.0.0',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^/addressData'), ''),
        },
        ['/google']: {
          target: 'https://accounts.google.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^/google'), ''),
        },
      },
    },
    // plugins
    plugins: createVitePlugins(),
  };
};
