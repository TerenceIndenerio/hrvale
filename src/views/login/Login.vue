<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Refresher />
      <div class="internet-container">
        <p v-if="isOnline">Status: Online</p>
        <p v-else>Status: Offline</p>
        <p v-if="downloadSpeed !== null">
          Speed: {{ downloadSpeed.toFixed(2) }} Mbps
        </p>
      </div>
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
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { runBackgroundScript } from "@/notification/Notification.ts";
import generateToken from "@/store/token/accessToken.ts";
import Refresher from "@/components/refresher/Refresher.vue";
import { mapState, mapGetters, mapActions, useStore } from "vuex";

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
    const store = useStore();
    const router = useRouter();

    const empNumber = computed(() => store.getters["adminUser/empNumber"]);
    const adminUserDetails = computed(
      () => store.getters["adminUser/adminUserDetails"]
    );

    return {
      store,
      router,
      empNumber,
      adminUserDetails,
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
      empID: "",
      appVersion: "0.1.52",
    };
  },

  async mounted() {
    try {
      this.checkInternetConnection();
      const hasSetup = localStorage.getItem("hasSetup");

      if (!hasSetup || hasSetup === "false") {
        this.$nextTick(() => {
          this.router.replace("/welcomepage");
        });
        return;
      }

      this.store.commit("loader/updateLoader", true);
      this.fetchStoredTheme();
      this.fetchLogo();
      await this.hasPincode();
      localStorage.removeItem("clickedTab");

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

      const requiredAppVersion = brandingConfig.configuration.appVersion;
      localStorage.setItem("appVersion", this.appVersion);

      if (hasSetup && !this.$platform.is("ios")) {
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
      this.store.commit("loader/updateLoader", false);
    }
  },

  computed: {
    ...mapGetters("adminUser", ["adminUserDetails", "empNumber"]),
    ...mapState("internet", ["isOnline", "downloadSpeed"]),
  },

  methods: {
    ...mapActions("adminUser", ["fetchAdminUserDetails"]),
    ...mapActions("internet", ["checkInternetConnection"]),
    async hasPincode() {
      try {
        const hasSetup = localStorage.getItem("hasSetup");
        if (!hasSetup) {
          this.router.replace("/welcomepage");
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

    async checkToken() {
      const storedToken = localStorage.getItem("token");

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

    async validatePincode(pincode) {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = baseURL + `api/auth/pincode`;

        const headers = {
          Authorization: authToken,
        };

        const postData = { pincode };

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

    async fetchUserDetails() {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = { Authorization: `Bearer ${storedToken}` };
        const api = `${baseURL}api/v2/user/me`;

        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && dataResponse.data.data) {
          const userData = dataResponse.data.data;

          if (userData.employee && userData.employee.empNumber) {
            this.$store.commit("adminUser/SET_ADMIN_USER_DETAILS", userData);
          } else {
            console.warn(
              "Warning: Employee data is missing from API response."
            );
          }

          localStorage.setItem("myDetails", JSON.stringify(userData));
        } else {
          console.error("Error: Unexpected API response format.");
        }
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    },

    async OnLogin(pincode) {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.checkToken();
        await this.fetchToken();

        await this.fetchUserDetails();

        this.empNumber = this.$store.getters["adminUser/empNumber"];

        if (!this.empNumber) {
          console.error(
            "Error: Employee ID is null or undefined after fetching user details."
          );
          return;
        }

        await this.store.dispatch(
          "adminUser/fetchAdminUserDetails",
          this.empNumber
        );

        await runBackgroundScript();
        await this.validatePincode(pincode);
      } catch (error) {
        console.error("Error in OnLogin:", error);
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
          console.error("No theme data found.");
        }
      } catch (error) {
        console.error("Error fetching theme data:", error);
      }
    },

    async presentAlert(message, onOkay) {
      const alert = await alertController.create({
        header: "Update!",
        message,
        buttons: [{ text: "Okay", handler: onOkay }],
      });

      await alert.present();
    },

    async alertError() {
      const alert = await alertController.create({
        header: "Invalid Pincode",
        message: "The pincode you entered is incorrect. Please try again.",
        buttons: [{ text: "Close" }],
      });
      await alert.present();
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
