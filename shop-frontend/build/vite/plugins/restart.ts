/**
 * @name ConfigRestartPlugin
 * @description restart vite for config
 */
import ViteRestart from 'vite-plugin-restart';

export const ConfigRestartPlugin = () => {
  return ViteRestart({
    restart: ['*.config.[jt]s', '**/config/*.[jt]s'],
  });
};
