import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
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
    plugins: {
      "PushNotifications": {
        "presentationOptions": ["badge", "sound", "alert"]
      }
    },
  },
};

export default config;
