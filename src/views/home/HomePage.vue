<template>
  <ion-page>
    <HeaderUser :headerTitle="headerTitle" :headerColor="theme.primaryColor"></HeaderUser>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <CardWImg
        :cardHeader="extractedData.name"
        :cardText="extractedData.note"
        :img_src="img_src"
      />
      <ClockinCard
        :btnText="btnText"
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
} from "@ionic/vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import CardWImg from "@/components/cards/CardWImg.vue";
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

const baseURL = GlobalConstants.HOST_URL;

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
    CardWImg,
    ClockinCard,
    HomeRandomCard,
    Refresher,
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
      cardHeader: "Update",
      cardText: "is simply dummy text of the printing & typesetting industry.",
      img_src: "assets/images/card_img1.png",
      theme: {},
      btnText: "Clock In",
      orgData: [],
      extractedData: [],
      loading: true,
    };
  },
  methods: {
    ...mapMutations("loader", ["updateLoader"]),
    async fetchData() {
      try {
        this.store.commit("loader/updateLoader", true);
        const authPayload = {
          clientId: "test_id",
          clientSecret: "test_secret",
          userId: 1,
        };
        const authResponse = await axios.post(baseURL + "auth/token", authPayload);
        const authToken = `Bearer ${authResponse.data.token}`;
        const apiUrl = baseURL + `api/v2/admin/organization`;
        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl, { headers });

        const extractedData = response.data.data;

        this.extractedData = extractedData;
        console.log(this.extractedData);
        this.store.commit("loader/updateLoader", false);
        this.loading = false;
      } catch (error) {
        console.error("Error:", error);
        this.store.commit("loader/updateLoader", false);
      }
    },
  },

  created() {
    this.updateLoader(false);
    this.fetchData();
    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
    this.theme = storedThemeData;
  },
});
</script>
