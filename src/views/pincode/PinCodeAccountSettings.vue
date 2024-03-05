<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container" :style="{ backgroundColor: theme.primaryColor }">
        <div class="title-container">
          <h1 class="title" :style="{ color: theme.primaryFontColor }">
            Enter PIN
          </h1>
          <h1 class="title-icon" :style="{ color: theme.primaryFontColor }">
            <ion-icon name="document-lock-outline"></ion-icon>
          </h1>
        </div>
      </div>

      <div class="bottom container">
        <div class="pincode-container">
          <h4 class="input-title">Please Enter Your PIN</h4>
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
              class="send-btn"
              expand="block"
              color="none"
              @click="saveButtonClicked"
              :style="{
                backgroundColor: theme.primaryColor,
                color: theme.primaryFontColor,
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
  IonIcon,
} from "@ionic/vue";
import ChangePinBottomInputContainer from "@/components/others/ChangePinBottomInputContainer.vue";
import { defineComponent, ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";

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
    IonIcon,
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
      theme: {},
      inputs: null,
    };
  },

  methods: {
    // Expiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

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
        const storedToken = localStorage.getItem("token");

        const authToken = `Bearer ${storedToken}`;

        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = {
          Authorization: authToken,
        };

        const pincode = this.input;

        const response = await axios.get(apiUrl, { headers });
        console.log(response.data.data.pincode, pincode);

        if (response.status === 200) {
          if (this.inputs === response.data.data.pincode) {
            this.$router.push("/pincodesetup");
          } else {
            console.error(
              "Entered PIN code does not match the stored PIN code"
            );
            this.showErrorMessage("PIN codes do not match!");
          }
        } else {
          console.error("API request failed:", response.status, response.data);
        }
      } catch (error) {
        this.showErrorMessage(
          "An error occurred: " + error.response?.data?.error?.message
        );
      } finally {
        this.store.commit("loader/updateLoader", false);

        this.inputs = null;
      }
    },

    resetClicked() {
      this.inputs = Array.from({ length: this.inputs.length }, () => "");
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
    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  created() {
    this.fetchTheme();
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
.title-icon {
  font-size: 70px;
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
  margin-top: 20px;
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
  margin: 5px 0;
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
