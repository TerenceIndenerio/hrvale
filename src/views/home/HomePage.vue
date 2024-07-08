<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :imgLogo="theme.clientLogo"
    ></HeaderUser>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <CardWImgHome
        :cardHeader="extractedData.name"
        :cardText="extractedData.note"
        :img_src="img_src"
      />
      <ClockinCard
        :btnColor="theme.primaryColor"
        :btnTextColor="theme.primaryFontColor"
      />
      <HomeRandomCard :btnColor="theme.primaryColor" />
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
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import CardWImgHome from "@/components/cards/CardWImgHome.vue";
import ClockinCard from "@/components/cards/HomeClockInCard.vue";
import HomeRandomCard from "@/components/cards/HomeRandomCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import axios from "axios";
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import { getThemeData } from "@/theme/theme";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { PushNotifications } from "@capacitor/push-notifications";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    HeaderUser,
    CardWImgHome,
    ClockinCard,
    HomeRandomCard,
    Refresher,
    toastController,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Home",
      cardHeader: "SUY-SING COMMERCIAL CORPORATION",
      cardText: "",
      img_src: "assets/images/card_img1.png",
      theme: {},
      btnText: "Clock In",
      orgData: [],
      extractedData: [],
      loading: true,
      imgLogo: "",
    };
  },
  methods: {
    ...mapMutations("loader", ["updateLoader"]),

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

    async fetchData() {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const apiUrl = baseURL + `api/v2/admin/organization`;

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const response = await axios.get(apiUrl, { headers });

        const extractedData = response.data.data;

        this.extractedData = extractedData;

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error("Error:", error);
        this.store.commit("loader/updateLoader", false);
      } finally {
        this.loading = false;
      }
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "light",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } catch (error) {
        console.error("Error displaying toast:", error);
      }
    },
  },

  created() {
    this.updateLoader(false);
    this.checkTokenExpiration();
    this.fetchData();
    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
  },
});
</script>
