<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
    ></HeaderUser>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <div class="btn-container">
        <h4><strong>Security</strong></h4>

        <div class="button-container" @click="navigateTo('pincodeaccsettings')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon btn-icon"
            viewBox="0 0 512 512"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          >
            <path
              fill="currentColor"
              d="M479.07 111.35a16 16 0 00-13.15-14.75C379.89 81.18 343.69 69.12 266 34.16c-7.76-2.89-12.57-2.84-20 0-77.69 35-113.89 47-199.92 62.44a16 16 0 00-13.15 14.75c-3.85 61.1 4.34 118 24.36 169.15a348.86 348.86 0 0071.43 112.41c44.67 47.43 94.2 75.12 119.74 85.6a20 20 0 0015.11 0c27-10.92 74.69-37.82 119.71-85.62a348.86 348.86 0 0071.43-112.39c20.02-51.14 28.21-108.05 24.36-169.15z"
            />
          </svg>

          <span>Setup Pin Code</span>
        </div>

        <h4><strong>Support</strong></h4>

        <a
          class="button-container"
          @click="navigateTo('FAQs')"
          href="https://hrvale.com/index.php/frequently-ask-questions/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon btn-icon"
            viewBox="0 0 512 512"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          >
            <path
              d="M160 164s1.44-33 33.54-59.46C212.6 88.83 235.49 84.28 256 84c18.73-.23 35.47 2.94 45.48 7.82C318.59 100.2 352 120.6 352 164c0 45.67-29.18 66.37-62.35 89.18S248 298.36 248 324"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="40"
            />
            <circle fill="currentColor" cx="248" cy="399.99" r="32" />
          </svg>

          <span>FAQs</span>
        </a>

        <a
          class="button-container"
          @click="navigateTo('ContactUs')"
          href="https://hrvale.com/index.php/contact-us/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon btn-icon"
            viewBox="0 0 512 512"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          >
            <path
              fill="currentColor"
              d="M424 80H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h336a56.06 56.06 0 0056-56V136a56.06 56.06 0 00-56-56zm-14.18 92.63l-144 112a16 16 0 01-19.64 0l-144-112a16 16 0 1119.64-25.26L256 251.73l134.18-104.36a16 16 0 0119.64 25.26z"
            />
          </svg>

          <span>Contact Us</span>
        </a>

        <h4><strong>Legal</strong></h4>

        <a class="button-container" @click="navigateTo('termsandcondition')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon btn-icon"
            viewBox="0 0 512 512"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          >
            <path
              fill="currentColor"
              d="M428 224H288a48 48 0 01-48-48V36a4 4 0 00-4-4h-92a64 64 0 00-64 64v320a64 64 0 0064 64h224a64 64 0 0064-64V228a4 4 0 00-4-4z"
            />
            <path
              fill="currentColor"
              d="M419.22 188.59L275.41 44.78a2 2 0 00-3.41 1.41V176a16 16 0 0016 16h129.81a2 2 0 001.41-3.41z"
            />
          </svg>

          <span>Terms and Conditions</span>
        </a>

        <a class="button-container" @click="navigateTo('PrivacyPolicy')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon btn-icon"
            viewBox="0 0 512 512"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          >
            <path
              fill="currentColor"
              d="M368 192h-16v-80a96 96 0 10-192 0v80h-16a64.07 64.07 0 00-64 64v176a64.07 64.07 0 0064 64h224a64.07 64.07 0 0064-64V256a64.07 64.07 0 00-64-64zm-48 0H192v-80a64 64 0 11128 0z"
            />
          </svg>
          <span>Privacy Policy</span>
        </a>

        <br />
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
import HeaderUser from "@/views/Suysing/components/HeaderUser.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

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
      const storedToken = localStorage.getItem("token");

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
      localStorage.setItem("clickedTab", "home");
      console.log(localStorage.getItem("clickedTab"));
      this.$router.push("/login");

      setTimeout(() => {
        window.location.reload();
      }, 50);
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

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
  text-decoration: none;
  color: #000;
}
.button-container span {
  font-size: 18px;
}
.btn-icon {
  height: 50px;
  width: auto;
  margin: 0 10px;
  padding: 10px;
  border-radius: 50%;
}
</style>
