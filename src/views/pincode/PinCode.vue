<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div
        class="container"
        :style="{ backgroundColor: themeData.primaryColor }"
      >
        <div class="title-container">
          <h1 class="title" :style="{ color: themeData.primaryFontColor }">
            Enter PIN
          </h1>
        </div>
      </div>

      <div class="bottom container">
        <div class="pincode-container">
          <h4 class="input-title">Enter PIN to proceed to payslip</h4>
          <div class="pincode-circle-container">
            <input
              v-for="(input, index) in inputs"
              :key="index"
              :id="`input-${index}`"
              v-model="inputs[index]"
              @input="handleInput(index)"
              maxlength="1"
              class="otp-input"
            />
          </div>
          <div class="btn-container">
            <ion-button
              class="send-btn"
              expand="block"
              color="none"
              @click="saveButtonClicked"
              :style="{
                backgroundColor: themeData.primaryColor,
                color: themeData.primaryFontColor,
              }"
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
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonButton,
  toastController,
} from "@ionic/vue";
import ChangePinBottomInputContainer from "@/components/others/ChangePinBottomInputContainer.vue";
import { defineComponent, ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;
const empNumber = GlobalConstants.EMPLOYEE_ID;

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    ChangePinBottomInputContainer,
    IonButton,
    toastController,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Suy Sing",
      theme: {},
      buttonText: "Submit",
      inputs: ["", "", "", "", ""],
      themeData: {},
    };
  },
  methods: {
    // Expiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("_token");

      if (!storedToken) {
        console.error("Token not available.");
        console.log("Token is missing. Redirecting to login...");
        this.router.push("/login");
        return;
      }

      const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() > expirationTime) {
        console.log("Token expired. Redirecting to login...");
        this.router.push("/login");
      }
    },

    handleInput(index) {
      if (index < this.inputs.length - 1 && this.inputs[index].length === 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    },
    async saveButtonClicked() {
      try {
        this.store.commit("loader/updateLoader", true);
        this.checkTokenExpiration();
        const storedToken = localStorage.getItem("_token");

        const authToken = `Bearer ${storedToken}`;

        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = {
          Authorization: authToken,
        };

        const pincode = parseInt(this.inputs.join(""), 10);

        const response = await axios.post(
          apiUrl,
          {
            pincode,
          },
          {
            headers,
          }
        );

        if (response.status === 200) {
          this.$router.push("/viewpayslip");
        } else {
          console.error("API request failed:", response.status, response.data);
        }
      } catch (error) {
        this.showErrorMessage(
          "An error occurred: " + error.response?.data?.error?.message
        );
      } finally {
        this.store.commit("loader/updateLoader", false);
        this.inputs = Array.from({ length: this.inputs.length }, () => "");
      }
    },
    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "danger",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } catch (error) {
        console.error("Error displaying toast:", error);
      }
    },
    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.themeData = storedThemeData;
      }

      this.themeData = storedThemeData;
      // console.log(this.theme);
    },
  },
  created() {
    this.getTheme();
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Alata");
* {
  margin: 0;
  padding: 0;
}
.container {
  /* background-color: #12a3da; */
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
  /* height: 60vh; */
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  background-color: #e8e8e8;
  margin: 5px;
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
  height: 35%;
}
.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
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
.btn-container {
  width: 50%;
}
.send-btn {
  border-radius: 15px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
}
.bottom-text {
  /* width: 100%; */
  /* margin: 10% 0; */
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
