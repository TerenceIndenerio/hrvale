<template>
  <ion-page>
    <HeaderUser :headerTitle="headerTitle" :headerColor="theme.primaryColor"></HeaderUser>
    <ion-content :fullscreen="true">
      <Refresher />
      <ion-card class="card">
        <h1>SOON</h1>
        <p>This Page is still not available.</p>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonCard } from "@ionic/vue";
import { defineComponent } from "vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderUser,
    Refresher,
    IonCard,
  },
  data() {
    return { headerTitle: "Other Page" };
  },
  created() {
    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
    this.theme = storedThemeData;
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
  font-size: 70px;
  font-family: "Open Sans";
}
</style>
