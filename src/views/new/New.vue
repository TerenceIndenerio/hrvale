<template>
  <ion-page>
    <ion-content class="content-container">
      <ion-card class="card">
        <div class="input-container">
          <label for="company">Company:</label>
          <input type="text" name="company" id="company" />
        </div>
        <div class="input-container">
          <label for="username">Username:</label>
          <input type="text" name="username" id="username" />
        </div>
        <div class="input-container">
          <label for="password">Password:</label>
          <input type="password" name="password" id="password" />
        </div>

        <ion-button> Submit </ion-button>
      </ion-card>
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
  IonText,
  IonAlert,
  IonSpinner,
  alertController,
  IonCard,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonAlert,
    IonSpinner,
    alertController,
    IonCard,
    IonButton,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
});
</script>

<style scoped>
.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.card {
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 10px;
}
.input-container input {
  width: 100%;
}
</style>
