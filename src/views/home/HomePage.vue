<template>
  <ion-page>
    <HeaderUser :headerTitle="headerTitle" :headerColor="theme.primaryColor"></HeaderUser>
    <ion-content :fullscreen="true">
      <Refresher />
      <CardWImg :cardHeader="cardHeader" :cardText="cardText" :img_src="img_src" />
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

import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import { getThemeData } from "@/theme/theme";

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
  data() {
    return {
      headerTitle: "Home",
      cardHeader: "Update",
      cardText: "is simply dummy text of the printing & typesetting industry.",
      img_src: "assets/images/card_img1.png",
      theme: {},
      btnText: "Clock In",
    };
  },
  methods: {
    ...mapMutations("loader", ["updateLoader"]),
  },
  created() {
    this.updateLoader(false);

    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
    this.theme = storedThemeData;
  },
});
</script>
