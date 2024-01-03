import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "SuySing",
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
  },
};

export default config;
