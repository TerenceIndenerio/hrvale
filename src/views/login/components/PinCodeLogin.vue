<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container" :style="{ backgroundColor: theme.primaryColor }">
        <div class="title-container">
          <h1 class="title" :style="{ color: theme.primaryFontColor }">
            Enter PIN
          </h1>
          <h1 class="title-icon">
            <ion-icon
              name="document-lock-outline"
              :style="{ color: theme.primaryFontColor }"
            ></ion-icon>
          </h1>
        </div>
      </div>

      <div class="bottom container">
        <div class="pincode-container">
          <h4 class="input-title">Enter PIN</h4>
          <div class="pincode-circle-container">
            <input
              v-model="inputs"
              maxlength="4"
              class="otp-input"
              type="tel"
              placeholder="####"
            />
          </div>

          <div class="btn-container">
            <ion-button
              class="login-btn"
              expand="block"
              color="none"
              @click="submitForm"
              :style="{ backgroundColor: theme.primaryColor }"
              >{{ this.buttonText }}</ion-button
            >
          </div>
        </div>
        <div class="bottom-text">
          <p>© 2023 BAPPLWARE Technologies, <br />Inc. All rights reserved.</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonInput, IonPage, IonButton, IonIcon, IonContent } from "@ionic/vue";
import Button from "@/components/buttons/Button.vue";

export default {
  components: {
    Button,
    IonInput,
    IonPage,
    IonButton,
    IonIcon,
    IonContent,
  },
  props: {
    theme: Object,
  },
  data() {
    return {
      buttonText: "Login",
      form: {},
      inputs: null,
    };
  },
  emits: ["login"],
  methods: {
    submitForm() {
      this.$emit("login", this.form);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Alata");
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 40vh;
}
.logo-name h1 {
  text-align: right;
  color: #fff;
  font-family: Alata;
  font-size: 31.567px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-right: 20px;
}
.bg-container {
  display: flex;
  justify-content: center;
}
.bottom {
  overflow-y: auto;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 50px 50px 0 0;
  height: 70vh;
}
.container {
  border-top: 1px solid rgb(157, 157, 157);

  width: 100%;
}

.box-container {
  border-radius: 9px;
  background-color: #e8e8e8;
}
.input-title {
  color: #3b3c3e;
  font-family: Inter;
  font-size: 19px;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
}
.otp-input {
  width: 200px;
  height: 50px;
  border-radius: 30px;
  text-align: center;
  background-color: #e8e8e8;
  margin: 5px;
  font-size: 20px;
}
.verify-container {
  width: 100%;
  display: flex;
  justify-content: right;
  height: fit-content;
}
.verify-text {
  padding: 5px 10px;
  background-color: #eb7491;
  width: fit-content;
  text-align: right;
  border-radius: 30px;
  margin: 10px 0 0 0;
}
.pincode-circle-container {
  display: flex;
  justify-content: space-around;
}
.pincode-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}
.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  flex-direction: column;
}
.title {
  height: 50px;
  font-family: Open Sans;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
}
.title-icon {
  font-size: 70px;
}
.btn-container {
  width: 50%;
  margin-top: 20px;
}
.login-btn {
  border-radius: 15px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  margin: 5px 0;
  background-color: #8b8b8b;
}
.reset-btn {
  border-radius: 15px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  color: #8b8b8b;
  margin: 5px 0;
}
.bottom-text {
  padding: 0;
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
}
.bottom-text p {
  padding: 0;
  margin: 0;
  text-align: center;
  color: rgba(128, 128, 128, 0.7);
}
</style>
