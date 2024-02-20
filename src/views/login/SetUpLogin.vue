<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="loaded">
      <div>
        <div
          class="container"
          :style="{ backgroundColor: themeData.primaryColor }"
        >
          <ion-text class="logo-banner">
            <img :src="imgLogo" alt="" />
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
import Alert2 from "@/components/alert/Alert2.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { mapGetters, mapActions, mapState } from "vuex";
import { GlobalConstants } from "@/config/constants";
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
      newAccessToken: "",
      configs: "",
      hasToken: false,
    };
  },
  async mounted() {
    this.loaded = true;
  },
  methods: {
    async OnLogin(value) {
      try {
        const response = await generateToken(value.username, value.password);
        const token = response.data.access_token;

        if (token) {
          this.router.push("/login");
        } else {
          console.log("Invalid Credentials");
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
