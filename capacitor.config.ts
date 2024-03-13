import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bapplware.hrvale",
  appName: "HRVale",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Filesystem: {
      web: "src/js/capacitor-file-system.js",
    },
    App: {
      web: "src/js/capacitor-app.js",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
