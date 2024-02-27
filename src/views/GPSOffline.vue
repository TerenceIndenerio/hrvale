<template>
  <ion-page>
    <HeaderReturnServices
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturnServices>
    <ion-content :fullscreen="true">
      <Refresher />

      <ion-card class="card">
        <h1><ion-icon name="warning-outline"></ion-icon></h1>
        <h1>GPS is Off</h1>
        <p>Please turn on your GPS.</p>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonCard, IonIcon } from "@ionic/vue";
import HeaderReturnServices from "@/components/header/HeaderReturnServices.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderReturnServices,
    Refresher,
    IonCard,
    IonIcon,
  },
  data() {
    return { headerTitle: "Suy Sing", theme: {} };
  },
  methods: {
    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  async created() {
    this.fetchTheme();
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
.card {
  border-radius: 20px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.card h1 {
  font-size: 50px;
  margin: 0;
  font-family: "Open Sans";
}
</style>
