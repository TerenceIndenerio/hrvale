<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true">
      <Refresher />

      <iframe
        src="https://bapplware.com/hrp-privacy-policy/"
        width="100%"
        height="85%"
        frameborder="0"
      ></iframe>
      <div class="checkbox-container">
        <ion-checkbox></ion-checkbox>

        <ion-label>
          I have read and accepted the
          <a href="https://bapplware.com/hrp-privacy-policy/" class="link"
            >Privacy Policy</a
          >
        </ion-label>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonCard,
  IonIcon,
  IonCheckbox,
  IonLabel,
  IonItem,
} from "@ionic/vue";
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
    IonCheckbox,
    IonLabel,
    IonItem,
  },
  data() {
    return {
      headerTitle: "Privacy Policy",
      theme: {},
      isPrivacyPolicyOpen: false,
      privacyPolicyUrl: "https://bapplware.com/hrp-privacy-policy/",
    };
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
    // this.openPrivacyPolicy();
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
.custom-modal {
  height: 80%;
}

.terms-and-conditions {
  padding: 20px;
}

.link {
  text-decoration: underline;
  margin-left: 5px; /* Adjust the margin for spacing between the checkbox and the link */
}

.checkbox-container {
  text-align: center;
  display: flex;
  justify-content: center;

  gap: 5px;
  width: 70%;
  margin: 10px auto;
}
</style>
