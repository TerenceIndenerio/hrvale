<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div
        class="container-bg"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
        }"
      >
        <div class="title-container">
          <h1 class="title" :style="{ color: theme.primaryFontColor }">
            <img :src="logo" alt="Logo" />
          </h1>
          <h4 class="input-title">Enter your PIN</h4>
          <div class="pincode-circle-container">
            <input
              v-model="inputs"
              maxlength="4"
              class="otp-input"
              type="tel"
              placeholder=""
              :style="{
                color: theme.primaryGradientStartColor,
              }"
              readonly
            />
          </div>
          <h4 class="dont-share">Never share your PIN with anyone.</h4>
        </div>
      </div>

      <div class="bottom container">
        <div class="pincode-container">
          <div class="btn-container">
            <div id="numericPad" class="ion-padding">
              <ion-row class="numpad-column">
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(1)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >1</ion-button
                  >
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(2)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >2</ion-button
                  >
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(3)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >3</ion-button
                  >
                </ion-col>
              </ion-row>

              <ion-row class="numpad-column">
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(4)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >4</ion-button
                  >
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(5)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >5</ion-button
                  >
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(6)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >6</ion-button
                  >
                </ion-col>
              </ion-row>

              <ion-row class="numpad-column">
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(7)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >7</ion-button
                  >
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(8)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >8</ion-button
                  >
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(9)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >9</ion-button
                  >
                </ion-col>
              </ion-row>

              <ion-row class="numpad-column">
                <ion-col class="numpad-row" size="4">
                  <!-- blank on purpose -->
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="appendDigit(0)"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                    >0</ion-button
                  >
                </ion-col>
                <ion-col class="numpad-row" size="4">
                  <ion-button
                    class="numeric-btn"
                    expand="full"
                    color="white"
                    size="large"
                    @click="backspace"
                    :style="{
                      color: theme.primaryGradientStartColor,
                    }"
                  >
                    <ion-icon name="backspace"></ion-icon>
                  </ion-button>
                </ion-col>
              </ion-row>
            </div>
          </div>
        </div>

        <div class="forgot-pin">
          <a
            href="https://hrp-uat-app.bapplware.com/web/index.php/reset/form/pincode"
            @click="forgotPin"
          >
            Forgot your PIN?
          </a>
        </div>

        <div class="bottom-text">
          <p
            :style="{
              color: theme.primaryGradientStartColor,
            }"
          >
            © 2024 BAPPLWARE Technologies, <br />Inc. All rights reserved.
          </p>
        </div>
      </div>
      <div class="app-version">
        <p>App Version: {{ this.appVersion }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonInput,
  IonPage,
  IonButton,
  IonIcon,
  IonContent,
  IonRow,
  IonCol,
} from "@ionic/vue";
import Button from "@/components/buttons/Button.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    Button,
    IonInput,
    IonPage,
    IonButton,
    IonIcon,
    IonContent,
    IonRow,
    IonCol,
  },
  props: {
    theme: Object,
    logo: String,
  },
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
  data() {
    return {
      buttonText: "Login",
      form: {},
      inputs: "",
      actualDigits: "",
      appVersion: "",
    };
  },
  emits: ["login"],

  methods: {
    appendDigit(digit) {
      if ((this.inputs || "").length < 4) {
        this.inputs = (this.inputs || "") + "•";
        this.actualDigits += digit;
      }

      if (this.inputs && this.inputs.length === 4) {
        this.$emit("login", this.actualDigits);
        this.resetInputs();
      }
    },
    backspace() {
      if (this.inputs.length > 0) {
        this.inputs = this.inputs.slice(0, -1);
        this.actualDigits = this.actualDigits.slice(0, -1);
      }
    },
    resetInputs() {
      this.inputs = "";
      this.actualDigits = "";
    },
    forgotPin() {
      localStorage.removeItem("pincode");
    },
  },
  created() {
    this.appVersion = localStorage.getItem("appVersion");
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Alata");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

* {
  margin: 0;
  padding: 0;
}
.container-bg {
  height: 60vh;
}
.logo-name h1 {
  text-align: right;
  color: #fff;
  font-family: Poppins;
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
  border-radius: 50px 50px 50px 50px;
  height: 55vh;
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
  color: white;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  opacity: 80%;
  display: flex;
  flex-direction: column;
  column-gap: 10px;
  flex-wrap: wrap;
  justify-content: space-around;
}
.dont-share {
  color: white;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  opacity: 70%;
  flex-wrap: wrap;
  justify-content: space-around;
  display: flex;
}
.otp-input {
  width: 200px;
  height: 50px;
  border-radius: 40px;
  border: none;
  text-align: center;
  font-size: 70px;
  color: #034ea2;
  background-color: white;
  flex-wrap: wrap;
  justify-content: space-around;
  display: flex;
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
  flex-direction: column;
  flex-wrap: wrap;
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
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 80%;
  flex-direction: column;
}
.title {
  height: 50px;
  font-family: Poppins;
  font-size: 30px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  border: none;
}
.title-icon {
  font-size: 70px;
}
.btn-container {
  width: 100%;
  margin-top: 5px;
  max-width: 500px;
}
.login-btn {
  border-radius: 15px;
  height: 70px;
  overflow: hidden;
  font-family: Poppins;
  font-size: 22px;
  font-style: normal;
  font-weight: 900;
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
  bottom: 30px;
  left: 0;
  right: 0;
  flex-wrap: wrap;
  justify-content: space-around;
}
.bottom-text p {
  padding: 0;
  margin: 0;
  text-align: center;
  color: #0f57a9;
  font-weight: 600;
  font-family: Poppins;
  font-size: 12px;
  flex-wrap: wrap;
  justify-content: space-around;
}
.forgot-pin {
  padding: 0;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}
.forgot-pin a {
  padding: 0;
  margin: 0;
  text-align: center;
  color: #f08d2f;
  font-weight: 900;
  font-family: Poppins;
  font-size: 20px;
  text-decoration: underline;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.mumpad-column {
  width: 100%;
}
.numeric-btn {
  border-color: none;
  font-family: Poppins;
  color: #034ea2;
  font-weight: 800;
  border-radius: 30px;
  border: none;
}
.app-version {
  position: absolute;
  left: 5px;
  bottom: 0;
}
.app-version p {
  font-size: 10px;
  color: gray;
}
</style>
