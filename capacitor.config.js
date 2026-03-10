/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.stratideck.app',
  appName: 'Stratideck',
  webDir: 'dist',
  plugins: {
    ScreenOrientation: {
      defaultOrientation: 'landscape',
    },
    StatusBar: {
      visible: false,
    },
  },
};

export default config;
