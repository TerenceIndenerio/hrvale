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
import { adminUserDetails, userDetails } from "@/store/login/onLoad";
import generateToken from "@/store/token/accessToken.ts";
import Refresher from "@/components/refresher/Refresher.vue";

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
    };
  },

  async mounted() {
    try {
      await this.checkSetupStatus();
      localStorage.removeItem("clickedTab");
      this.fetchStoredTheme();
      this.fetchLogo();
    } catch (error) {
      console.error("Error checking setup status:", error);
    } finally {
      this.loaded = true;
    }
  },

  methods: {
    async checkSetupStatus() {
      try {
        this.hasSetup = await localStorage.getItem("hasSetup");

        if (!this.hasSetup) {
          this.router.replace("/welcomepage");
        }
      } catch (error) {
        console.error(error);
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
      }
    },

    async fetchToken() {
      try {
        const storedToken = localStorage.getItem("access_token");
        const baseURL = localStorage.getItem("baseUrl");
        const response = await axios.post(baseURL + "auth/token", {
          secret: storedToken,
        });
        console.log(response);
        localStorage.setItem("token", response.data.token);
        this.hasToken = true;
      } catch (error) {
        console.error(error.response.data.error.status);
        if (error.message === "Request failed with status code 401") {
          this.checkToken();
        }
      }
    },

    async fetchStoredTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");
        console.log("Stored theme data:", storedThemeData);

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : [];
        console.log("Parsed theme data:", themeData);

        let themeConfiguration = null;

        for (const data of themeData) {
          if (data.configuration && data.configuration.theme) {
            themeConfiguration = data.configuration.theme;
            break;
          }
        }

        if (themeConfiguration) {
          console.log("Theme configuration:", themeConfiguration);

          this.theme = themeConfiguration;
          console.log("Theme:", this.theme);
        } else {
          console.error(
            "No theme data found in local storage or theme configuration not available."
          );
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
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
      } catch (error) {
        console.log(error.status);
      }
    },

    async hasPincode() {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;

        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl, { headers });

        if (response.data.data.pincode) {
          const pincode = Number(response.data.data.pincode);
          localStorage.setItem("pincode", pincode);
          this.pincodeData = pincode;
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
        await this.hasPincode();

        const stringValue = String(pincode);
        const pinString = String(this.pincodeData);

        if (stringValue === pinString && this.hasToken) {
          this.router.push("/tabs/buzzfeed");
        } else {
          this.alertError();
        }

        await runBackgroundScript();
        await userDetails(this.empNumber);
      } catch (error) {
        console.error(error);
      } finally {
        this.store.commit("loader/updateLoader", false);
        window.location.reload();
      }
    },

    fetchLogo() {
      const baseURL = localStorage.getItem("baseUrl");
      // const baseURL = "https://hrp-uat-app.bapplware.com/web/index.php/";
      this.logo = baseURL + "admin/theme/image/clientBanner";
      console.log("logo", this.logo);
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
  display: flex;
  justify-content: center;
  height: 100vh;
}
</style>
