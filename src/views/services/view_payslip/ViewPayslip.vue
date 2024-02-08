<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <div class="container">
        <ion-card class="card result-container">
          <h4
            class="text-center result-text neomorphic-input-2"
            :style="{
              color: theme.primaryColor,
            }"
          >
            {{ cardData.length }} Record Found
          </h4>

          <ion-card
            class="card-container neomorphic-card-1"
            v-for="(result, index) in cardData"
            :key="index"
          >
            <ion-grid>
              <ion-row>
                <ion-col class="col-name">
                  <p><strong>Month:</strong></p>
                </ion-col>
                <ion-col class="col-data">
                  <p>{{ result.month }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col class="col-name">
                  <p><strong>Year:</strong></p>
                </ion-col>
                <ion-col class="col-data">
                  <p>{{ result.year }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col class="col-name">
                  <p><strong>Frequency:</strong></p>
                </ion-col>
                <ion-col class="col-data">
                  <p>{{ result.frequency }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col class="col-name">
                  <p><strong>Net Pay:</strong></p>
                </ion-col>
                <ion-col class="col-data">
                  <p>{{ result.net_pay }}</p>
                </ion-col>
              </ion-row>
            </ion-grid>
            <ion-button
              expand="full"
              class="download-btn neomorphic-btn-2"
              color="none"
              @click="downloadPayslip(result.id)"
              :style="{ backgroundColor: theme.secondaryColor }"
            >
              <ion-icon name="download"></ion-icon> Download Payslip
            </ion-button>
          </ion-card>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonItem,
  IonList,
  IonCol,
  IonRow,
  IonGrid,
  toastController,
  IonIcon,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturnPayslip.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { IonDatetime } from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";
import { FileOpener } from "@capacitor-community/file-opener";
import {
  Filesystem,
  Directory,
  FilesystemEncoding,
} from "@capacitor/filesystem";

const baseURL = GlobalConstants.HOST_URL;
const empNumber = GlobalConstants.EMPLOYEE_ID;

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonDatetime,
    HeaderReturn,
    IonButton,
    IonCard,
    Refresher,
    IonItem,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    toastController,
    FileOpener,
    Directory,
    Filesystem,
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
      headerTitle: "View Payslip",
      buttonText: "Request Schedule",
      theme: {},
      loading: true,
      payslipData: [],
      carData: [],
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

    async requestData() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const storedToken = localStorage.getItem("_token");

        const authToken = `Bearer ${storedToken}`;

        const apiUrl = baseURL + `api/ess/view-payslip?limit=50&offset=0`;
        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl, { headers });

        this.payslipData = response.data.data;

        const extractedData = this.payslipData.map((entry) => ({
          month: entry.month,
          year: entry.year,
          frequency: entry.frequency,
          net_pay: entry.net_pay,
          id: entry.id,
        }));
        this.cardData = extractedData;
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message ===
            "Employee does not have a pincode"
        ) {
          this.$router.push("/pincodesetup");
        } else {
          this.showErrorMessage(
            "An error occurred: " + error.response?.data?.error?.message
          );
        }
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async downloadPayslip(id) {
      try {
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("_token");
        const authToken = `Bearer ${storedToken}`;

        const apiUrl = baseURL + `api/download/payslip/${id}`;
        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl, {
          headers,
        });

        const contentType = response.headers["content-type"];

        const { content, type } = response.data.data;

        const blob = new Blob([this.base64ToArrayBuffer(content)], { type });

        if (this.isWebPlatform()) {
          this.downloadOnWeb(blob); // web
        } else {
          await this.downloadOnMobile(blob); // app
        }
      } catch (error) {
        console.error("Error:", error);
        this.showErrorMessage("An error occurred: " + error.message);
      }
    },
    downloadOnWeb(blob) {
      console.log(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "payslip.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },

    async downloadOnMobile(blob) {
      try {
        const payslipPath = "payslip.pdf";

        const base64String = await this.blobToBase64(blob);

        const writeResult = await Filesystem.writeFile({
          path: payslipPath,
          data: base64String,
          directory: Directory.Documents,
          encoding: FilesystemEncoding.Base64,
        });

        if (writeResult.uri) {
          const fileUri = await Filesystem.getUri({
            path: payslipPath,
            directory: Directory.Documents,
          });

          this.showAlertMessage(
            "Payslip Successfully Downloaded! Check the Documents."
          );
        } else {
          console.error(
            "File write operation failed. Missing URI in the result."
          );
          this.showAlertMessage(
            "Failed to download Payslip. Please try again."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        this.showErrorMessage(
          "An error:" + error.response?.data?.error?.message
        );
      }
    },

    isWebPlatform() {
      return window.hasOwnProperty("cordova") ? false : true;
    },
    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },
    async blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "light",
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

    async showAlertMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 2000,
          position: "top",
          color: "light",
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
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },
  },
  async created() {
    this.getTheme();
    await this.requestData();

    this.loading = false;
  },
});
</script>

<style scoped>
.text-center {
  text-align: center;
}

p {
  margin: 0;
}
.result-text {
  text-align: center;
  margin: 10px auto;
  padding: 5px 10px;
  width: 60%;
}
.result-container {
  padding: 0 10px;
}
.download-btn {
  height: 50px;
  margin: 0 auto;
}

.card-container {
  border-radius: 20px;
  width: 270px;
  margin: 20px auto;
}
.container {
  max-width: 500px;
  margin: auto;
}
</style>
