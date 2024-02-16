<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :imgLogo="theme.clientLogo"
    ></HeaderUser>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <div class="btn-container">
        <h4><strong>Security</strong></h4>

        <div class="button-container" @click="navigateTo('pincodeaccsettings')">
          <ion-icon
            class="btn-icon"
            name="shield"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          ></ion-icon>
          <span>Setup Pin Code</span>
        </div>

        <h4><strong>Support</strong></h4>

        <div class="button-container" @click="navigateTo('FAQs')">
          <ion-icon
            class="btn-icon"
            name="help"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          ></ion-icon>
          <span>FAQs</span>
        </div>

        <div class="button-container" @click="navigateTo('ContactUs')">
          <ion-icon
            class="btn-icon"
            name="mail"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          ></ion-icon>
          <span>Contact Us</span>
        </div>

        <h4><strong>Legal</strong></h4>

        <div class="button-container" @click="navigateTo('TermsAndConditions')">
          <ion-icon
            class="btn-icon"
            name="document"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          ></ion-icon>
          <span>Terms and Conditions</span>
        </div>

        <div class="button-container" @click="navigateTo('PrivacyPolicy')">
          <ion-icon
            class="btn-icon"
            name="lock-closed"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          ></ion-icon>
          <span>Privacy Policy</span>
        </div>

        <br />

        <div class="button-container" @click="logout">
          <ion-icon
            class="btn-icon"
            name="log-out"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          ></ion-icon>
          <span>Log Out</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonItem,
  IonList,
  IonCol,
  IonRow,
  IonGrid,
  toastController,
  IonIcon,
} from "@ionic/vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;
const empNumber = GlobalConstants.EMPLOYEE_ID;

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderUser,
    IonButton,
    IonCard,
    Refresher,
    IonItem,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    toastController,
    IonIcon,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Account Settings",
      theme: {},
      loading: true,
    };
  },
  methods: {
    // Expiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("_token");

      if (!storedToken) {
        console.error("Token not available.");
        console.log("Token is missing. Redirecting to login...");
        this.router.push("/login");
        return;
      }

      const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() > expirationTime) {
        console.log("Token expired. Redirecting to login...");
        this.router.push("/login");
      }
    },

    navigateTo(page) {
      console.log(`Navigating to ${page}`);
      this.$router.push(`/${page}`);
    },

    logout() {
      localStorage.removeItem("_token");
      this.$router.push("/login");
      console.log("Logging out");
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("theme");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  async created() {
    this.fetchTheme();
    this.loading = false;
  },
});
</script>

<style scoped>
.btn-container {
  display: flex;
  flex-direction: column;
  margin: 10px 0 0 20px;
  gap: 10px;
  margin-bottom: 100px;
}
.button-container {
  height: 50px;
  display: flex;
  align-items: center;
}
.button-container span {
  font-size: 18px;
}
.btn-icon {
  font-size: 24px;
  margin: 0 10px;

  padding: 10px;
  border-radius: 50%;
}
</style>
