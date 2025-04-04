<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <ion-card class="neomorphic-card-1 search-container">
        <h5 :style="{ color: theme.primaryColor }" class="search-title">
          Select Date
        </h5>
        <div class="input-container">
          <div class="container-inner">
            <p :style="{ color: theme.primaryColor }" class="label">From</p>
            <div class="select-option neomorphic-input-2">
              <ion-input type="date" v-model="fromDate" class="date-input" />
            </div>
          </div>

          <div class="container-inner">
            <p :style="{ color: theme.primaryColor }" class="label">To</p>
            <div class="select-option neomorphic-input-2">
              <ion-input type="date" v-model="toDate" class="date-input" />
            </div>
          </div>
        </div>

        <ion-button
          expand="full"
          class="search-btn-container neomorphic-btn-2"
          color="none"
          :style="{ backgroundColor: theme.primaryColor }"
          @click="fetchData(this.fromDate, this.toDate)"
        >
          Search
        </ion-button>
      </ion-card>

      <div class="container">
        <div class="result-container">
          <h4
            class="text-center"
            :style="{
              color: theme.primaryColor,
            }"
          >
            {{ cardData.length }} Record Found
          </h4>

          <!-- ON CLick fetchViewPayslip Trigger for Modal-->
          <ion-card
            class="card-container neomorphic-card-1"
            v-for="(result, index) in cardData"
            :key="index"
            @click="fetchViewPayslip(result.id)"
          >
            <svg
              width="33"
              height="40"
              viewBox="0 0 33 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="icon-btn"
            >
              <g filter="url(#filter0_d_3_2171)">
                <path
                  d="M12.813 9.11111C12.813 8.63962 13.0024 8.18743 13.3397 7.85403C13.677 7.52063 14.1345 7.33333 14.6115 7.33333C15.0885 7.33333 15.546 7.52063 15.8833 7.85403C16.2206 8.18743 16.4101 8.63962 16.4101 9.11111V17.0578L18.5863 17.2889L27.4712 21.1822C28.4245 21.6089 29 22.5511 29 23.5822V31.3333C28.946 32.7911 27.777 33.9467 26.3022 34H14.6115C13.9281 34 13.2806 33.7333 12.813 33.2356L4 25.7689L5.33094 24.4C5.67266 24.0267 6.15827 23.8311 6.66187 23.8311H7.05755L12.813 26.8889V9.11111ZM14.6115 2C16.5195 2 18.3494 2.7492 19.6986 4.0828C21.0478 5.41639 21.8058 7.22513 21.8058 9.11111C21.8058 11.7778 20.3669 14.0356 18.2086 15.2622V13.0933C19.3058 12.1156 20.0072 10.6933 20.0072 9.11111C20.0072 7.69662 19.4387 6.34007 18.4268 5.33988C17.4149 4.33968 16.0425 3.77778 14.6115 3.77778C13.1805 3.77778 11.8081 4.33968 10.7962 5.33988C9.7843 6.34007 9.21583 7.69662 9.21583 9.11111C9.21583 10.6933 9.91727 12.1156 11.0144 13.0933V15.2622C8.85612 14.0356 7.41727 11.7778 7.41727 9.11111C7.41727 7.22513 8.17523 5.41639 9.52441 4.0828C10.8736 2.7492 12.7035 2 14.6115 2Z"
                  fill="white"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_3_2171"
                  x="0"
                  y="0"
                  width="33"
                  height="40"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_3_2171"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_3_2171"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
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
                  <p><strong>Payroll Period:</strong></p>
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
              v-if="!isIOS"
              expand="full"
              class="download-btn neomorphic-btn-2"
              color="none"
              @click="downloadPayslip(result.id)"
              :style="{ backgroundColor: theme.secondaryColor }"
            >
              <ion-icon name="download"></ion-icon> Download Payslip
            </ion-button>
          </ion-card>
        </div>
      </div>
      <PayslipModal
        :isOpen="isPayslipModalOpen"
        :incomeDetails="payslipIncome"
        :deductionDetails="payslipDeductions"
        :netPay="this.netPay"
        :viewPayslipData="this.viewPayslipData"
        :thirteenthMonthData="this.thirteenthMonthData"
        :isThirteenthMonth="this.isThirteenthMonth"
        :grossPay="this.grossPay"
        :grossDeduction="this.grossDeduction"
        :theme="theme"
        @update:isOpen="isPayslipModalOpen = $event"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  isPlatform,
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
  IonInput,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturnPayslip.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import PayslipModal from "@/views/services/view_payslip/components/PayslipModal.vue";
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
  Encoding,
} from "@capacitor/filesystem";

export default defineComponent({
  components: {
    isPlatform,
    Encoding,
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
    IonInput,
    PayslipModal,
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
      cardData: [],
      selectedMonth: null,
      selectedYear: null,
      selectedMonthYear: null,
      filteredCardData: [],
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      months: [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 },
      ],
      isPayslipModalOpen: false,
      payslipIncome: [{ name: "", amount: "" }],
      payslipDeductions: [{ name: "", amount: "" }],
      payslipGrossPay: null,
      payslipNetPay: null,
      viewPayslipData: null,
      grossPay: null,
      netPay: null,
      grossDeduction: null,
      isIOS: false,
      isThirteenthMonth: false,
      thirteenthMonthData: null,
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

    filterResults() {
      const [selectedYear, selectedMonth] = this.selectedMonthYear.split("-");

      this.filteredCardData = this.cardData.filter((result) => {
        if (result.month && result.year) {
          const monthName = new Date(`${result.year}-${result.month}-01`)
            .toLocaleString("default", { month: "long" })
            .toLowerCase();

          const selectedMonthName = new Date(
            `${selectedYear}-${selectedMonth}-01`
          )
            .toLocaleString("default", { month: "long" })
            .toLowerCase();

          return (
            result.year.toString() === selectedYear &&
            monthName === selectedMonthName
          );
        } else {
          return false;
        }
      });
    },

    async requestData() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
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
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");
        const authToken = `Bearer ${storedToken}`;
        const baseURL = localStorage.getItem("baseUrl");
        const checkPayslipUrl = `${baseURL}api/web/ess/view-payslip/${id}`;
        const apiUrl = `${baseURL}api/download/payslip/${id}`;
        let thirteenthMonthUrl = `${baseURL}api/upload-thirteenth-month-pay/${id}?type=download`;

        const headers = {
          Authorization: authToken,
        };

        const checkResponse = await axios.get(checkPayslipUrl, { headers });
        const { thirteenthMonthPay } = checkResponse.data.data;

        const downloadUrl = thirteenthMonthPay ? thirteenthMonthUrl : apiUrl;

        const response = await axios.get(downloadUrl, { headers });

        const contentType = response.headers["content-type"];
        const { content, type } = response.data.data;

        const blob = new Blob([this.base64ToArrayBuffer(content)], { type });

        if (this.isWebPlatform()) {
          this.downloadOnWeb(blob); // Web
        } else {
          await this.downloadOnMobile(blob); // Mobile
        }
      } catch (error) {
        console.error("Error:", error);
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
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
      this.showAlertMessage(
        "Payslip Successfully Downloaded! Check the Documents."
      );
    },

    async downloadOnMobile(blob) {
      try {
        const payslipPath = `payslip_${Date.now()}.pdf`;
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

    async fetchData(fromDate, toDate) {
      try {
        console.log(fromDate, toDate);
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;

        const apiUrl =
          baseURL +
          `api/web/ess/view-payslip?limit=50&offset=0&date=${fromDate}&dateEnd=${toDate}`;
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

    async fetchViewPayslip(id) {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = `${baseURL}api/web/ess/view-payslip/${id}`;
        const headers = { Authorization: authToken };

        const response = await axios.get(apiUrl, { headers });

        const responseData = response.data.data;

        if (responseData.thirteenthMonthPay) {
          this.isThirteenthMonth = true;
          this.thirteenthMonthData = responseData.thirteenthMonthPay;
          console.log(this.thirteenthMonthData);
        } else {
          this.isThirteenthMonth = false;

          if (responseData.summary) {
            this.viewPayslipData = responseData.summary;
            this.grossPay = responseData.payroll?.gross_compensation || "0";
            this.netPay = responseData.payroll?.net_pay || "0";
            this.grossDeduction = responseData.payroll?.total_deductions || "0";
            console.log(this.viewPayslipData.income);
          } else {
            this.viewPayslipData = null;
          }
        }
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
        this.isPayslipModalOpen = true;
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

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  async created() {
    this.isIOS = isPlatform("ios");
    await this.checkTokenExpiration();
    this.fetchTheme();
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
  width: 100%;
  max-width: 350px;
  height: fit-content;
  margin: 20px auto;
  padding: 20px;
}
.container {
  max-width: 500px;
  margin: auto;
}
.filter-container {
  margin: 0 auto;
  overflow: hidden;
  padding: 5px 20px 20px 10px;
}
.input-container {
  overflow: hidden;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-picker {
  margin: 0;
  padding: 0;
  width: 270px;
}
.label {
  margin-bottom: 5px;
  text-align: center;
}
.arrow-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.arrow-icons {
  font-size: 20px;
  margin-right: 5px;
}
.search-container {
  margin: 10px auto 20px auto;
  padding: 10px;
}
.search-title {
  font-family: "Inter";
  font-weight: bold;
  text-align: center;
  margin: 0 0 10px 0;
}
.container-inner {
  margin: 5px;
}
.container-inner p {
  padding-left: 20px;
  width: fit-content;
}
.search-btn-container {
  height: 30px;
  width: 100px;
  float: right;
  right: 10px;
}
.label {
  font-family: "Inter";
  font-weight: bold;
}
.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 120px;
}
.icon-btn {
  color: gray;
  background-color: rgb(233, 233, 233);
  border-radius: 10px;
  height: 45px;
  width: 45px;
  background: linear-gradient(145deg, #f0f0f0, #cacaca);
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
