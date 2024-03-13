<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="loaded">
      <SetupPinCodeLogin @login="OnLogin" :theme="theme" />
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
import SetupPinCodeLogin from "@/views/login/components/SetupPinCodeLogin.vue";
import SVGLoginImage from "@/views/login/components/Svg.vue";
import Alert2 from "@/components/alert/Alert2.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { mapGetters, mapActions, mapState } from "vuex";
import { GlobalConstants } from "@/config/constants";
import axios from "axios";
import { getThemeData, setThemeData } from "@/theme/theme";
import { newToken } from "@/store/token/newToken.ts";
import generateToken from "@/store/token/accessToken.ts";

const id = GlobalConstants.USER_ID;

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    SetupPinCodeLogin,
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
      newaccess_token: "",
      configs: "",
      hasToken: false,
      tokenData: "",
      empNumber: "",
    };
  },

  async mounted() {
    await this.fetchToken();
    this.fetchStoredTheme();

    this.hasPincode();

    localStorage.removeItem("clickedTab");
    this.loaded = true;
  },

  methods: {
    checkToken() {
      const storedToken = localStorage.getItem("token");
      const storedRefereshToken = localStorage.getItem("refreshtoken");

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
        const baseURL = localStorage.getItem("baseUrl");

        const response = await axios.post(baseURL + "auth/token", {
          secret: storedToken,
        });

        localStorage.setItem("token", response.data.token);
        this.tokenData = response.data.token;
        this.hasToken = true;
      } catch (error) {
        console.error("error", error.message);
        if (error.message === "Request failed with status code 401") {
          this.checkToken();
        }
      }
    },

    async storePincode(pin) {
      try {
        this.fetchToken();
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${this.tokenData}`;

        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = {
          Authorization: authToken,
        };

        const pincode = Number(pin);
        console.log(pin, pincode);

        const response = await axios.post(apiUrl, { pincode }, { headers });

        if (response.status === 200) {
          this.alertSuccess("Please do not share your pincode to others.");
        }
      } catch (error) {
        console.log(error.response?.data?.error?.message);
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
        this.fetchToken();
        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.tokenData}`,
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
        console.log(error.message);
        if (error.message === "Request failed with status code 401") {
          this.checkToken();
        } else {
          this.router.replace("/setuplogin");
        }
      }
    },

    async OnLogin(value) {
      try {
        if (this.hasToken) {
          localStorage.setItem("pincode", value);
          this.storePincode(value);
          await this.fetchToken();
          this.router.push("/tabs/buzzfeed");
        }
      } catch (error) {
        console.error(error);
      }
    },

    async hasPincode() {
      try {
        this.fetchToken();
        const storedToken = localStorage.getItem("token");
        const authToken = `Bearer ${this.tokenData}`;
        const baseURL = localStorage.getItem("baseUrl");
        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl, { headers });
        console.log("pincode response", response.data.data.pincode);

        console.log(response.data.data.pincode);

        if (response.data.data.pincode) {
          localStorage.setItem("pincode", response.data.data.pincode);
          this.router.push("/tabs/buzzfeed");
        }
      } catch (error) {
        console.log(error.response?.data?.error?.message);
      }
    },

    async alertError() {
      const showAlert = async () => {
        const alert = await alertController.create({
          header: "Invalid Credentials",
          message: "Please try again.",
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

    async alertSuccess(message) {
      const showAlert = async () => {
        const alert = await alertController.create({
          header: "Saved Successfully!",
          message: message,
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
