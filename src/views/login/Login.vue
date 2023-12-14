<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div v-if="loaded">
        <div class="container" :style="{ backgroundColor: themeData.primaryColor }">
          <ion-text class="logo-banner">
            <img :src="imgLogo" alt="SUYSING" />
          </ion-text>
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
import SVGLoginImage from "@/views/login/components/Svg.vue";
import Alert2 from "@/components/alert/Alert2.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { mapGetters, mapActions, mapState } from "vuex";
import { GlobalConstants } from "@/config/constants";
import axios from "axios";
import { getThemeData, setThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    LoginForm,
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
      data: "",
      alertText: "test text Lorem ipsum.",
      imgLogo: "",
      themeData: {},
      bgTheme: "",
      loaded: false,
    };
  },
  async mounted() {
    console.log("mounted login");
    await this.fetchTheme();
  },
  methods: {
    async fetchTheme() {
      try {
        const response = await axios.post(baseURL + "auth/token", {
          clientId: "test_id",
          clientSecret: "test_secret",
          userId: 1,
        });

        const token = response.data.token;

        if (!token) {
          console.error("Token not available.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const apiUrl = baseURL + `api/v2/admin/theme`;

        const responseData = await axios.get(apiUrl, { headers });

        this.themeData = responseData.data.data;
        setThemeData(this.themeData);

        this.imgLogo =
          baseURL +
          `admin/theme/image/loginBanner?` +
          responseData.data.data.clientBanner.filename;

        this.themeData = {
          name: responseData.data.data.name,
          primaryColor: responseData.data.data.variables.primaryColor,
          primaryFontColor: responseData.data.data.variables.primaryFontColor,
          secondaryColor: responseData.data.data.variables.secondaryColor,
          secondaryFontColor: responseData.data.data.variables.secondaryFontColor,
          primaryGradientStartColor:
            responseData.data.data.variables.primaryGradientStartColor,
          primaryGradientEndColor:
            responseData.data.data.variables.primaryGradientEndColor,
          clientLogo:
            baseURL +
            `admin/theme/image/loginBanner?` +
            responseData.data.data.clientLogo.filename,
          clientBanner:
            baseURL +
            `admin/theme/image/loginBanner?` +
            responseData.data.data.clientBanner.filename,
          loginBanner:
            baseURL +
            `admin/theme/image/loginBanner?` +
            responseData.data.data.loginBanner.filename,
        };

        setThemeData(this.themeData);

        this.bgTheme = "background-color: " + this.themeData.primaryColor;

        this.btnColorTheme = this.themeData.primaryColor;

        this.loaded = true;
        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error("Error making the API request: ", error);
      }
    },
    async OnLogin(value) {
      try {
        const response = await this.store.dispatch("token/generateToken", {
          username: value.username,
          password: value.password,
        });

        const token = response.data.token;
        if (token) {
          localStorage.setItem("_token", token);
          this.router.push("/tabs/home");
        } else {
          console.log("Invalid username and/or password");
          await this.alertError();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async alertError() {
      const showAlert = async () => {
        const alert = await alertController.create({
          header: "Invalid Credentials",
          message: "The username or password you entered is incorrect. Please try again.",
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
  height: 100%;
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
