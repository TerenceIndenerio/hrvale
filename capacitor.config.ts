import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'SuySing',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Geolocation: {
      // Add any Geolocation plugin configurations here
      // For example:
      // enableHighAccuracy: true,
      timeout: 5000,
      // maximumAge: 0
    }
  }
  
};

export default config;
