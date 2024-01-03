<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
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
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderReturn,
    Refresher,
    IonCard,
    IonIcon,
  },
  data() {
    return { headerTitle: "Suy Sing", theme: {} };
  },
  methods: {
    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },
  },
  async created() {
    this.getTheme();
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
