import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sheikah.slate',
  appName: '希卡石板',
  webDir: 'dist',
  // 完全离线：不加载任何远程资源
  server: {
    androidScheme: 'https',
  },
};

export default config;
