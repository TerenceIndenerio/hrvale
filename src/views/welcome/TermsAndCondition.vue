<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Refresher />
      <div class="content">
        <iframe
          src="https://bapplware.com/hrp-terms-and-conditions/"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </div>

      <div class="checkbox-container">
        <ion-checkbox v-model="isChecked"></ion-checkbox>

        <ion-label>
          I have read and accepted the
          <a href="https://bapplware.com/hrp-terms-and-conditions/" class="link"
            >Terms and Condition</a
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
import { useRouter } from "vue-router";

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
  setup() {
    return {
      router: useRouter(),
    };
  },
  data() {
    return {
      headerTitle: "Terms & Condition",
      theme: {},
      isPrivacyPolicyOpen: false,
      privacyPolicyUrl: "https://bapplware.com/hrp-terms-and-conditions/",
      isChecked: false,
    };
  },
  watch: {
    isChecked(newValue) {
      if (newValue) {
        console.log("Checkbox is checked!");
        this.router.push("/welcomeprivacyandpolicy");
      }
    },
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
.custom-modal {
  height: 80%;
}

.terms-and-conditions {
  padding: 20px;
}

.link {
  text-decoration: underline;
  margin-left: 5px;
}

.checkbox-container {
  text-align: center;
  display: flex;
  justify-content: center;

  gap: 5px;
  width: 70%;
  margin: 10px auto;
}
.content {
  height: 90vh;
}
</style>
