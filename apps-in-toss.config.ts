import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'bubble-wrap',
  brand: {
    primaryColor: '#5B8DEF', // 뽁뽁이 비닐의 은은한 블루
  },
  permissions: [],
  webBundleDir: 'dist',
});
