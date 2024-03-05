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
      newaccess_token: "",
      configs: "",
      hasToken: false,
      theme: {},
      hasSetup: false,
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
          localStorage.setItem("hasSetup", true);
          this.router.push("/setuppincodelogin");
        }
      } catch (error) {
        console.error(error.message);
        await this.alertError();
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
