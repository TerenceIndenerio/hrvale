import { Module, ActionContext } from "vuex";
import { alertController } from "@ionic/vue";
import type { RootState } from "../store";

export interface InternetState {
  isOnline: boolean;
  downloadSpeed: number | null;
}

const state: InternetState = {
  isOnline: navigator.onLine,
  downloadSpeed: null,
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

type InternetContext = ActionContext<InternetState, RootState>;

const actions = {
  checkInternetConnection({ commit, dispatch }: InternetContext) {
    if (navigator.onLine) {
      commit("SET_ONLINE");
      dispatch("measureInternetSpeed");
    } else {
      commit("SET_OFFLINE");
      actions.showOfflineAlert();
    }

    window.addEventListener("online", () => {
      dispatch("handleOnline");
    });
    window.addEventListener("offline", () => {
      dispatch("handleOffline");
    });
  },

  handleOnline({ commit, dispatch }: InternetContext) {
    commit("SET_ONLINE");
    console.log("You are back online");
    actions.showOnlineAlert();
    dispatch("measureInternetSpeed");
  },

  handleOffline({ commit }: InternetContext) {
    commit("SET_OFFLINE");
    console.log("You are offline");
    actions.showOfflineAlert();
  },

  async measureInternetSpeed({ commit }: InternetContext) {
    const connection = (navigator as any).connection;
    if (connection && connection.downlink) {
      commit("SET_SPEED", connection.downlink);
    } else {
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
        const fileSize = 272 * 92 * 4;
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

const internetModule: Module<InternetState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default internetModule;
