<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="loaded">
      <Refresher />
      <PinCodeLogin @login="OnLogin" :theme="theme" :logo="logo" />
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
import { adminUserDetails } from "@/store/login/onLoad";
import generateToken from "@/store/token/accessToken.ts";
import Refresher from "@/components/refresher/Refresher.vue";

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
    Refresher,
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
      newaccess_token: "",
      configs: "",
      hasToken: false,
      hasSetup: false,
      empNumber: "",
      pincodeData: "",
      empID: "",
      appVersion: "0.1.44",
    };
  },

  async mounted() {
    try {
      await this.hasPincode();
      localStorage.removeItem("clickedTab");
      this.fetchStoredTheme();
      this.fetchLogo();

      const storedThemeData = localStorage.getItem("configs");
      const storedCredentials = JSON.parse(
        localStorage.getItem("userCredentials")
      );

      const response = await generateToken(
        storedCredentials.username,
        storedCredentials.password,
        storedCredentials.client
      );

      const brandingConfig = response.data.configs.find(
        (item) => item.name === "branding"
      );

      const servicesConfig = brandingConfig.configuration.services;
      const theme = brandingConfig.configuration.theme;
      const client = brandingConfig.configuration.client;
      localStorage.setItem("servicesConfig", JSON.stringify(servicesConfig));
      localStorage.setItem("themeData", JSON.stringify(theme));
      localStorage.setItem("client", JSON.stringify(client));

      const requiredAppVersion = brandingConfig.configuration.appVersion;

      localStorage.setItem("appVersion", this.appVersion);

      const hasSetup = localStorage.getItem("hasSetup");
      if (hasSetup) {
        if (this.appVersion !== requiredAppVersion) {
          const message = `App Version Needs to be ${requiredAppVersion}. Please Update your App.`;
          await this.presentAlert(message, () => {
            window.location.href =
              "https://play.google.com/store/apps/details?id=com.bapplware.hrvale&pcampaignid=web_share";
          });
        }
      }
    } catch (error) {
      console.error("Error checking setup status:", error);
    } finally {
      this.loaded = true;
    }
  },

  methods: {
    async hasPincode() {
      try {
        const hasSetup = localStorage.getItem("hasSetup");
        if (!hasSetup) {
          this.router.push("/welcomepage");
        }

        await this.fetchToken();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = { Authorization: authToken };
        const response = await axios.get(apiUrl, { headers });

        if (!response.data.data.pincode) {
          this.router.push("/welcomepage");
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    async checkToken() {
      const storedToken = localStorage.getItem("token");
      const storedRefereshToken = localStorage.getItem("refreshtoken");

      if (storedToken) {
        try {
          const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
          const currentTimestamp = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
            console.log("HRP Token has expired");

            await newToken().then((res) => {
              if (res) {
                this.hasToken = true;
              }
            });
          } else {
            console.log("Token is still valid");
            this.hasToken = true;
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        console.log("No token found");
        this.router.push("/welcomepage");
      }
    },

    async fetchToken() {
      try {
        const storedToken = localStorage.getItem("access_token");
        const baseURL = localStorage.getItem("baseUrl");
        const response = await axios.post(baseURL + "auth/token", {
          secret: storedToken,
        });

        localStorage.setItem("token", response.data.token);
        this.hasToken = true;
      } catch (error) {
        await this.checkToken();
      }
    },

    async fetchUserDetails() {
      try {
        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api = baseURL + `api/v2/user/me`;

        const dataResponse = await axios.get(api, { headers });

        localStorage.setItem(
          "empNumber",
          dataResponse.data.data.employee.empNumber
        );

        localStorage.setItem(
          "myDetails",
          JSON.stringify(dataResponse.data.data)
        );

        this.empNumber = dataResponse.data.data.employee.empNumber;
        this.empID = dataResponse.data.data.id;
      } catch (error) {
        console.log(error.status);
      }
    },

    async validatePincode(pincode) {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = baseURL + `api/auth/pincode`;

        const headers = {
          Authorization: authToken,
        };

        const postData = {
          pincode: pincode,
        };

        const response = await axios.post(apiUrl, postData, { headers });

        if (response.data.data.status) {
          await this.router.push("/tabs/buzzfeed");
          window.location.reload();
        } else {
          this.alertError();
        }
      } catch (error) {
        console.log(error.response?.data?.error?.message);
      }
    },

    async OnLogin(pincode) {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.checkToken();
        await this.fetchToken();
        await this.fetchUserDetails();
        await runBackgroundScript();
        await this.validatePincode(pincode);
      } catch (error) {
        console.error(error);
        console.log("error");
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    fetchLogo() {
      const baseURL = localStorage.getItem("baseUrl");

      this.logo = baseURL + "admin/theme/image/clientBanner";
    },

    async fetchStoredTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : [];

        let themeConfiguration = null;

        for (const data of themeData) {
          if (data.configuration && data.configuration.theme) {
            themeConfiguration = data.configuration.theme;
            break;
          }
        }

        if (themeConfiguration) {
          this.theme = themeConfiguration;
        } else {
          console.error(
            "No theme data found in local storage or theme configuration not available."
          );
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
      }
    },

    async presentAlert(message, onOkay) {
      const alert = await alertController.create({
        header: "Update!",
        message: message,
        buttons: [
          {
            text: "Okay",
            handler: onOkay,
          },
        ],
      });

      await alert.present();
    },

    async alertError() {
      const showAlert = async () => {
        const alert = await alertController.create({
          header: "Invalid Pincode",
          message: "The pincode you entered is incorrect. Please try again.",
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
  display: flex;
  justify-content: center;
  height: 100vh;
}
</style>
