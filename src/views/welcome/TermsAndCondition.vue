<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Refresher />

      <div
        class="content"
        :style="{
          'background-image':
            'linear-gradient(to right top, #008e9c, #00828f, #007782, #006b75, #006069)',
        }"
      >
        <div class="logo-banner">
          <img src="@/assets/images/hrvaleofficiallogofinal.png" alt="logo" />
        </div>

        <div class="text-container">
          <p>
            "In order to start using HR Vale, please first agree to our Terms
            and Conditions."
          </p>

          <div class="checkbox-container">
            <ion-checkbox
              v-model="isChecked"
              class="checkbox-input"
            ></ion-checkbox>

            <ion-label>
              I have read and accepted the
              <a
                href="https://hrvale.com/index.php/terms-and-conditions/"
                class="link"
                >Terms and Conditions</a
              >
            </ion-label>
          </div>
        </div>
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
      privacyPolicyUrl: "https://hrvale.com/index.php/terms-and-conditions/",
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

.text-container p {
  color: #fff;
  padding: 5px 10px;
  text-align: center;
  font-size: 16px;
}

.card {
  border-radius: 20px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.card h1 {
  font-size: 30px;
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
  align-items: center;
  gap: 10px;
  width: 80%;
  margin: 10px auto;
  background-color: #fff;
  padding: 10px 20px;
}

.checkbox-input {
  height: 50px;
  width: fit-content;
}

.content {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-self: center;
  flex-direction: column;
}
.text-container {
  margin: 10px auto;
  padding: 5px 10px;
  width: fit-content;
}

.logo-banner {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 600px) {
  .text-container {
    width: auto;
  }
}
</style>
