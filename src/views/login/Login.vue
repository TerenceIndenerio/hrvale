<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container">
        <ion-text class="logo-name">
          <img src="assets/images/loginBanner2.png" alt="SUYSING" />
        </ion-text>
        <div class="bg-container">
          <Svg></Svg>
        </div>
      </div>
      <LoginForm @login="OnLogin" />
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
import Svg from "@/views/login/components/Svg.vue";
import Alert2 from "@/components/alert/Alert2.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    LoginForm,
    Svg,
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
    };
  },
  async mounted() {
    console.log("mounted login");
    if (localStorage.getItem("_token")) {
      this.router.push("/tabs/home");
      this.store.commit("loader/updateLoader", false);
    }
  },
  methods: {
    async OnLogin(value) {
      try {
        await this.store.dispatch("token/generateToken");
        this.store.commit("loader/updateLoader", true);
        this.router.push("/tabs/home");
        this.store.commit("loader/updateLoader", false);
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
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Alata");
* {
  margin: 0;
  padding: 0;
}
.container {
  background-color: #12a3da;
  height: 100%;
}
.logo-name h1 {
  text-align: center;
  color: #fff;
  font-family: Alata;
  font-size: 31.567px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-right: 20px;
}

.logo-name {
  text-align: center;
  width: 100%;
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
