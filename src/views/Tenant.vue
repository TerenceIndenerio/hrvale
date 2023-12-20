<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="none">
        <img
          src="https://bapplware.com/wp-content/uploads/2020/05/cropped-logo-1.png"
          alt="Bapplware Technologies, Inc."
          class="logo"
        />
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding content-container">
      <ion-card class="login-card" color="light">
        <ion-card-header>
          <ion-card-title class="title"><strong>Login Form</strong></ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-label>Company ID </ion-label>
          <div class="input-container">
            <ion-input
              class="neomorphic-input"
              v-model="companyId"
              placeholder="Enter company id"
            ></ion-input>
          </div>
          <ion-label>Username </ion-label>
          <div class="input-container">
            <ion-input
              class="neomorphic-input"
              v-model="username"
              placeholder="Enter username"
            ></ion-input>
          </div>
          <ion-label>Password </ion-label>
          <div class="input-container">
            <ion-input
              class="neomorphic-input"
              v-model="password"
              type="password"
              placeholder="Enter password"
            ></ion-input>
          </div>

          <ion-button class="btn" expand="full" color="primary" @click="login"
            >Login</ion-button
          >

          <div class="link-container">
            <a href="https://www.facebook.com/bapplware/" target="_blank">
              <ion-icon name="logo-facebook" class="ion-icon-facebook"></ion-icon>
            </a>

            <a
              href="https://www.linkedin.com/company/bapplware-technologies-inc."
              target="_blank"
            >
              <ion-icon name="logo-linkedin" class="ion-icon-linkedin"></ion-icon>
            </a>

            <a
              href="https://www.youtube.com/channel/UC9gtmb8fpM3lqqszEkgxX7g"
              target="_blank"
            >
              <ion-icon name="logo-youtube" class="ion-icon-youtube"></ion-icon>
            </a>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      companyId: "",
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      console.log("Login clicked");
    },
  },
});
</script>

<style scoped>
ion-header {
  border-radius: 0 0 20px 20px;
  padding: 0 10px;
}
.logo {
  width: auto;
  height: 50px;
}
.login-card {
  margin-top: 5vh;
  background: #f0f0f0;
  border-radius: 10px;
  box-shadow: 5px 5px 15px #d9d9d9, -5px -5px 15px #ffffff;
}

.neomorphic-input {
  margin: 0;
  padding: 0;
}

.input-container {
  overflow: hidden;
  background-color: #f8f8f8;
  border-radius: 20px;
  box-shadow: inset 3px 3px 5px #d9d9d9, inset -3px -3px 5px #ffffff;
  margin-bottom: 15px;
  padding: 0 5px;
  height: fit-content;
}

ion-button {
  --ion-color-base: #3498db;
  --ion-color-contrast: #fff;
  --ion-color-hover: #2980b9;
}

.title {
  text-align: center;
  margin-bottom: 10px;
}

.btn {
  margin-top: 50px;
  border-radius: 10px;
  overflow: hidden;
}

.link-container {
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: row;
  justify-content: right;
  padding: 10px 20px;
}

.link-container a ion-icon {
  font-size: 30px;
}

/* Mobile-specific styles */
@media only screen and (min-width: 600px) {
  .login-card {
    margin: 20px auto;
    max-width: 600px;
  }
}
</style>
