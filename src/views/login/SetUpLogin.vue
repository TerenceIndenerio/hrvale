<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="loaded">
      <div>
        <div
          class="bg-container"
          :style="{
            'background-image':
              'linear-gradient(to right top, #008e9c, #00828f, #007782, #006b75, #006069)',
          }"
        >
          <div class="logo-banner">
            <img src="@/assets/images/hrvaleofficiallogofinal.png" alt="logo" />
          </div>
        </div>

        <LoginForm
          @login="OnLogin"
          :btnBackgroundColor="themeData.primaryColor"
          :btnColor="themeData.primaryFontColor"
        />
      </div>
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
import LoginForm from "@/views/login/components/LoginForm.vue";
import Alert2 from "@/components/alert/Alert2.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { mapGetters, mapActions, mapState } from "vuex";
import { GlobalConstants } from "@/config/constants";
import generateToken from "@/store/token/accessToken.ts";
import axios from "axios";
import { runBackgroundScript } from "@/notification/Notification.ts";
import { adminUserDetails, userDetails } from "@/store/login/onLoad";

// const id = GlobalConstants.USER_ID;

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    LoginForm,
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
      themeData: {},
      bgTheme: "",
      loaded: false,
      token: "",
      newaccess_token: "",
      configs: "",
      hasToken: false,
      theme: {},
      hasSetup: false,
      empNumber: "",
    };
  },
  async mounted() {
    this.loaded = true;
  },
  methods: {
    async OnLogin(value) {
      try {
        const response = await generateToken(
          value.username,
          value.password,
          value.client
        );
        const token = response.data.access_token;

        if (token) {
          localStorage.setItem("hasSetup", true);
          await this.fetchStoredTheme();
          await this.hasPincode();
        }
      } catch (error) {
        console.error(error.message);
        await this.alertError();
      }
    },

    async fetchToken() {
      try {
        const storedToken = localStorage.getItem("access_token");
        const baseURL = localStorage.getItem("baseUrl");

        const response = await axios.post(baseURL + "auth/token", {
          secret: storedToken,
        });
        console.log("token response ", response);
        localStorage.setItem("token", response.data.token);
      } catch (error) {
        console.error(error.response.data.error.status);
      }
    },

    async hasPincode() {
      try {
        await this.fetchToken();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = { Authorization: authToken };
        const response = await axios.get(apiUrl, { headers });

        if (response.data.data.pincode) {
          await this.fetchUserDetails();
          await runBackgroundScript();
          await userDetails(this.empNumber);

          localStorage.setItem("pincode", response.data.data.pincode);
          this.router.push("/tabs/buzzfeed");
        } else {
          this.router.push("/setuppincodelogin");
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    async fetchUserDetails() {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = { Authorization: `Bearer ${storedToken}` };
        const api = baseURL + `api/v2/user/me`;
        const dataResponse = await axios.get(api, { headers });

        this.empNumber = dataResponse.data.data.employee.empNumber;
        localStorage.setItem(
          "empNumber",
          dataResponse.data.data.employee.empNumber
        );

        localStorage.setItem(
          "myDetails",
          JSON.stringify(dataResponse.data.data)
        );
      } catch (error) {
        console.log(error.message);
        if (error.message === "Request failed with status code 401") {
          this.checkToken();
        } else {
          this.router.replace("/setuplogin");
        }
      }
    },

    async fetchStoredTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");
        const configs = storedThemeData ? JSON.parse(storedThemeData) : [];

        const brandingConfig = configs.find((item) => item.name === "branding");

        if (brandingConfig) {
          const apiHost = brandingConfig.configuration.apiHost;
          localStorage.setItem("baseUrl", apiHost);
          console.log(apiHost);

          const theme = brandingConfig.configuration.theme;

          if (theme) {
            localStorage.setItem("themeData", JSON.stringify(theme));
            this.theme = theme;
            console.log(theme);
          } else {
            console.error("Theme not found in the branding configuration.");
          }
        } else {
          console.error("Configuration for branding not found.");
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
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
  display: flex;
  justify-content: center;
  height: 100vh;
}
</style>
