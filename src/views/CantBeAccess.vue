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
        <ion-icon :icon="lockClosedOutline" class="icon" />
        <h1>Access Denied</h1>
        <p>This can't be accessed because you are not authorized.</p>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonCard, IonIcon } from "@ionic/vue";
import { lockClosedOutline } from "ionicons/icons";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonIcon,
    HeaderReturn,
    Refresher,
  },
  data() {
    return {
      headerTitle: "Unauthorized",
      theme: {},
      lockClosedOutline,
    };
  },
  methods: {
    getTheme() {
      const storedThemeData = getThemeData();
      if (storedThemeData) {
        this.theme = storedThemeData;
      }
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
  text-align: center;
  padding: 20px;
}

.card h1 {
  font-size: 32px;
  font-family: "Open Sans";
  margin-top: 10px;
  color: #d9534f;
}

.card p {
  font-size: 16px;
  color: #444;
  margin-top: 10px;
}

.icon {
  font-size: 60px;
  color: #d9534f;
}
</style>
