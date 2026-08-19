import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yongxilingqian.app',
  appName: '永喜灵签',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
