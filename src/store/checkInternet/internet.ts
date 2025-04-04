import { Module } from "vuex";
import { alertController } from "@ionic/vue"; // Ionic alert controller
import type { RootState } from "../index"; // Import RootState

// Define state type
export interface InternetState {
  isOnline: boolean;
  downloadSpeed: number | null; // Speed in Mbps
}

const state: InternetState = {
  isOnline: navigator.onLine,
  downloadSpeed: null, // Initially unknown
};

const mutations = {
  SET_ONLINE(state: InternetState) {
    state.isOnline = true;
    console.log("You are online");
  },
  SET_OFFLINE(state: InternetState) {
    state.isOnline = false;
    console.log("You are offline");
  },
  SET_SPEED(state: InternetState, speed: number) {
    state.downloadSpeed = speed;
  },
};

const actions = {
  checkInternetConnection({ commit, dispatch }: any) {
    if (navigator.onLine) {
      commit("SET_ONLINE");
      dispatch("measureInternetSpeed"); // Measure speed on startup
    } else {
      commit("SET_OFFLINE");
      actions.showOfflineAlert();
    }

    window.addEventListener("online", () =>
      actions.handleOnline(commit, dispatch)
    );
    window.addEventListener("offline", () => actions.handleOffline(commit));
  },

  handleOnline({ commit, dispatch }: any) {
    commit("SET_ONLINE");
    console.log("You are back online");
    actions.showOnlineAlert();
    dispatch("measureInternetSpeed"); // Recalculate speed
  },

  handleOffline({ commit }: any) {
    commit("SET_OFFLINE");
    console.log("You are offline");
    actions.showOfflineAlert();
  },

  async measureInternetSpeed({ commit }: any) {
    const connection = (navigator as any).connection;
    if (connection && connection.downlink) {
      commit("SET_SPEED", connection.downlink); // Use browser API if available
    } else {
      // Fallback: Download a small file to estimate speed
      const startTime = performance.now();
      try {
        await fetch(
          "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          {
            mode: "no-cors",
            cache: "no-store",
          }
        );
        const duration = performance.now() - startTime;
        const fileSize = 272 * 92 * 4; // Rough estimate in bytes
        const speedMbps = (fileSize * 8) / (duration / 1000) / 1_000_000;
        commit("SET_SPEED", speedMbps);
      } catch {
        commit("SET_SPEED", 0);
      }
    }
  },

  async showOfflineAlert() {
    const alert = await alertController.create({
      header: "No Internet Connection",
      message:
        "You are currently offline. Please check your network connection.",
      buttons: ["OK"],
    });
    await alert.present();
  },

  async showOnlineAlert() {
    const alert = await alertController.create({
      header: "Connection Restored",
      message: "Your internet connection has been restored.",
      buttons: ["OK"],
    });
    await alert.present();
  },
};

// Define the Vuex module
const internetModule: Module<InternetState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default internetModule;
