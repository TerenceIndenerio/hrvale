<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      router-direction="none"
    ></HeaderReturn>
    <ion-content :fullscreen="true">
      <Refresher />

      <ion-card class="card">
        <h1>SOON</h1>
        <p>Please return to home page.</p>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonCard } from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderReturn,
    Refresher,
    IonCard,
  },
  data() {
    return { headerTitle: "SuySing" };
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
