<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="loaded">
      <PinCodeLogin @login="OnLogin" :theme="theme" />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonAlert,
  IonSpinner,
  alertController,
} from "@ionic/vue";
import PinCodeLogin from "@/views/login/components/PinCodeLogin.vue";
import SVGLoginImage from "@/views/login/components/Svg.vue";
import Alert2 from "@/components/alert/Alert2.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { mapGetters, mapActions, mapState } from "vuex";
import { GlobalConstants } from "@/config/constants";
import axios from "axios";
import { getThemeData, setThemeData } from "@/theme/theme";
import { runBackgroundScript } from "@/notification/Notification.ts";
import { newToken } from "@/store/token/newToken.ts";
import { adminUserDetails, userDetails } from "@/store/login/onLoad";
import generateToken from "@/store/token/accessToken.ts";

const baseURL = GlobalConstants.HOST_URL;
const id = GlobalConstants.USER_ID;

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    PinCodeLogin,
    SVGLoginImage,
    Alert2,
    IonAlert,
    IonSpinner,
    alertController,
  },

  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },

  data() {
    return {
      imgLogo: "",
      theme: {},
      bgTheme: "",
      loaded: false,
      token: "",
      newAccessToken: "",
      configs: "",
      hasToken: false,
      hasSetup: false,
    };
  },

  async mounted() {
    try {
      await this.checkSetupStatus();

      if (this.fetchToken()) {
        this.fetchStoredTheme();
      } else {
        console.log("Error fetching token");
        this.router.replace("/setuplogin");
      }
    } catch (error) {
      console.error("Error checking setup status:", error);
      this.router.replace("/setuplogin");
    } finally {
      this.loaded = true;
    }
  },

  methods: {
    async checkSetupStatus() {
      try {
        this.hasSetup = await localStorage.getItem("hasSetup");
        console.log(this.hasSetup);
        if (!this.hasSetup) {
          this.router.replace("/setuplogin");
        }
      } catch (error) {
        console.error(error);
      }
    },

    checkToken() {
      const storedToken = localStorage.getItem("token");
      const storedRefereshToken = localStorage.getItem("refresh_token");

      if (storedToken) {
        try {
          const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
          const currentTimestamp = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
            console.log("Token has expired");
            newToken();
            this.hasToken = true;
          } else {
            console.log("Token is still valid");
            this.hasToken = true;
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        console.log("No token found");
      }
    },

    async fetchToken() {
      try {
        const storedToken = localStorage.getItem("access_token");

        const response = await axios.post(baseURL + "auth/token", {
          secret: storedToken,
        });

        localStorage.setItem("token", response.data.token);
        this.hasToken = true;
      } catch (error) {
        console.error("error", error.message);
        if (error.message === "Request failed with status code 401") {
          this.checkToken();
        }
      }
    },

    async fetchStoredTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");
        const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};
        const theme = themeData[1]?.configuration?.theme;
        const configs = localStorage.getItem("configs");
        const config = configs ? JSON.parse(configs) : {};
        const apiHost = config[1]?.configuration?.apiHost;
        localStorage.setItem("baseUrl", apiHost);

        if (theme) {
          localStorage.setItem("themeData", JSON.stringify(theme));
          this.theme = theme;
        } else {
          console.error("Theme not found in the configuration data.");
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
      }
    },

    async fetchUserDetails() {
      try {
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api = baseURL + `api/v2/user/me`;

        const dataResponse = await axios.get(api, { headers });

        console.log(dataResponse.data.data.empNumber);
      } catch (error) {
        this.showErrorMessage(error.message);
      }
    },

    async OnLogin(value) {
      try {
        this.store.commit("loader/updateLoader", true);
        const pin = localStorage.getItem("pin");

        const stringValue = String(value);
        const pinString = String(pin);

        const empNumber = localStorage.getItem("empNumber");

        if (stringValue === pinString) {
          if (this.hasToken) {
            await this.fetchToken();

            this.fetchUserDetails();
            await userDetails(empNumber);
            await runBackgroundScript();
            this.router.push("/tabs/buzzfeed");
          }
        } else {
          await this.alertError();
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async alertError() {
      const showAlert = async () => {
        const alert = await alertController.create({
          header: "Invalid Credentials",
          message:
            "The username or password you entered is incorrect. Please try again.",
          buttons: [
            {
              text: "Close",
              htmlAttributes: {
                "aria-label": "close",
              },
            },
          ],
        });
        await alert.present();
      };
      return showAlert();
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Alata");
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 50vh;
}

.logo-banner {
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bg-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
