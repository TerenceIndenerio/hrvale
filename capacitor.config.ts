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
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    // SplashScreen: {
    //   launchShowDuration: 5000,
    //   launchAutoHide: true,
    //   launchFadeOutDuration: 3000,
    //   backgroundColor: "#ffffffff",
    //   androidSplashResourceName: "splash",
    //   androidScaleType: "CENTER_INSIDE",
    //   showSpinner: false,
    //   splashFullScreen: true,
    //   splashImmersive: true,
    // },
  },
};

export default config;
