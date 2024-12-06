<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <div class="result-container">
        <div v-for="(result, index) in results">
          <ion-card class="neomorphic-card-1 card-container" :key="index">
            <!-- Default -->
            <ion-grid>
              <div
                class="header-outline"
                :style="{ backgroundColor: theme.primaryColor }"
              >
                <p class="header-label">{{ result.day }} - {{ result.date }}</p>
              </div>
              <br />
              <br />
              <div class="card-content">
                <ion-row class="data-container">
                  <ion-col size="6">
                    <p>Applied Date:</p>
                  </ion-col>
                  <ion-col size="6">
                    <p>
                      <strong>{{ result.appliedDate.split(" ")[0] }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row class="data-container">
                  <ion-col size="6">
                    <p>Previous Actual In:</p>
                  </ion-col>
                  <ion-col size="6">
                    <p>
                      <strong>{{ result.previousActualIn }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row class="data-container">
                  <ion-col size="6">
                    <p>Actual In:</p>
                  </ion-col>
                  <ion-col size="6">
                    <p>
                      <strong>{{ result.actualIn }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row class="data-container">
                  <ion-col size="6">
                    <p>Previous Actual Out:</p>
                  </ion-col>
                  <ion-col size="6">
                    <p>
                      <strong>{{ result.previousActualOut }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row class="data-container">
                  <ion-col size="6">
                    <p>Actual Out:</p>
                  </ion-col>
                  <ion-col size="6">
                    <p>
                      <strong>{{ result.actualOut }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row class="data-container">
                  <ion-col size="6">
                    <p>Status:</p>
                  </ion-col>
                  <ion-col size="6">
                    <p>
                      <strong>{{ result.status }}</strong>
                    </p>
                  </ion-col>
                </ion-row>
              </div>
            </ion-grid>
          </ion-card>
        </div>
      </div>

      <!-- alert successfully submitted -->
      <ion-modal :is-open="isSuccessful" id="modal">
        <ion-card class="card-modal">
          <ion-card-header>
            <ion-card-title class="modal-header"
              >Success
              <ion-icon
                name="checkmark-circle"
                :style="{ color: theme.successColor }"
                class="close-btn"
              ></ion-icon
            ></ion-card-title>
          </ion-card-header>

          <ion-grid class="modal-content">
            <p>Attendance Correction Sent Successfully!</p>
            <ion-row>
              <ion-col>
                <ion-button @click="confirmSuccess">Okay</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonCard,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  toastController,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonInput,
  IonIcon,
  IonModal,
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
    HeaderReturn,
    IonSelect,
    IonSelectOption,
    Refresher,
    IonGrid,
    IonRow,
    IonCol,
    IonToast,
    toastController,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonInput,
    IonIcon,
    IonModal,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Recent Attendance Correction",
      payrollPeriodOption: [],
      authToken: null,
      noResult: false,
      results: [],
      onLoadResult: [],
      theme: {},
      loading: true,
      storedToken: null,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      empNumber: "",
      hasSearched: false,
      results2: [],
      actualIn: "",
      actualOut: "",
      comment: "",
      selectedReason: null,
      previousIn: "",
      previousOut: "",
      requestNumber: "",
      isSuccessful: false,
    };
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    this.applyAttendanceCorrection();
    this.fetchReasonOptions();
    this.requestNumberGenerator();
    this.loading = false;
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

    fetchTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : [];

        let themeConfiguration = null;

        for (const data of themeData) {
          if (data.configuration && data.configuration.theme) {
            themeConfiguration = data.configuration.theme;
            break;
          }
        }

        if (themeConfiguration) {
          this.theme = themeConfiguration;
        } else {
          console.error(
            "No theme data found in local storage or theme configuration not available."
          );
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
      }
    },

    showErrorMessage(message) {
      this.$ionic.toastController
        .create({
          message: message,
          duration: 3000,
          position: "bottom",
          color: "danger",
        })
        .then((toast) => {
          toast.present();
        });
    },
    async applyAttendanceCorrection() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");

        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api =
          baseURL +
          `api/v2/ess/apply-attendance-correction?empNumber=${this.empNumber}`;

        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((period) => ({
            date: period.date,
            day: period.day,
            previousActualIn: period.previousActualIn,
            previousActualOut: period.previousActualOut,
            appliedDate: period.appliedDate.date,
            fixedOt: period.fixedOt,
            fixedOtIn: period.fixedOtIn,
            fixedOtOut: period.fixedOtOut,
            actualIn: period.applyActualIn,
            actualOut: period.applyActualOut,
            status: period.status,
          }));
        }
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async fetchData() {
      try {
        this.hasSearched = true;
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const updatedEndDate = new Date(this.startDate);
        updatedEndDate.setDate(updatedEndDate.getDate() + 1);
        this.endDate = updatedEndDate.toISOString().split("T")[0];

        const api =
          baseURL +
          `api/v2/daily-logs?limit=50&offset=0&date=${this.startDate}&dateEnd=${this.endDate}`;
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((period) => ({
            id: period.id,
            date: period.date,
            day: period.day,
            actualIn: period.actualIn,
            actualOut: period.actualOut,
          }));

          this.previousIn = dataResponse.data.data[0].actualIn;
          this.previousOut = dataResponse.data.data[0].actualOut;
        }
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async saveCorrection() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v2/ess/apply-attendance-correction`;

        const empNumber = parseInt(this.empNumber);

        if (
          !this.actualIn ||
          !this.actualOut ||
          !this.comment ||
          !this.selectedReason
        ) {
          const toast = await toastController.create({
            message: "Please complete all input fields.",
            duration: 3000,
            position: "top",
            icon: "alert-circle-outline",
            buttons: [
              {
                icon: "close-outline",
                role: "cancel",
              },
            ],
          });
          await toast.present();
          return;
        }

        this.applyActualIn = this.formatTimeTo12Hour(this.actualIn);
        this.applyActualOut = this.formatTimeTo12Hour(this.actualOut);

        const payload = {
          requestNo: this.requestNumber,
          applyActualIn: this.applyActualIn,
          applyActualOut: this.applyActualOut,
          comment: this.comment,
          reason: this.selectedReason,
          date: this.startDate,
          empNumber: empNumber,
          previousIn: this.previousIn,
          previousOut: this.previousOut,
        };

        const dataResponse = await axios.post(api, payload, { headers });

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.isSuccessful = true;
        } else {
          console.log("Error occurred while sending attendance correction.");
          const toast = await toastController.create({
            message: "Error occurred while sending attendance correction.",
            duration: 3000,
            position: "top",
            icon: "alert-circle-outline",
            buttons: [
              {
                icon: "close-outline",
                role: "cancel",
              },
            ],
          });
          await toast.present();
        }
      } catch (error) {
        console.log(error);
        const toast = await toastController.create({
          message: error.response.data.error.message,
          duration: 3000,
          position: "top",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    confirmSuccess() {
      this.isSuccessful = false;
      window.location.reload();
    },

    generateRandomString(length) {
      return [...Array(length)]
        .map(() => Math.random().toString(36)[2])
        .join("");
    },

    requestNumberGenerator() {
      const randomString = this.generateRandomString(6);
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      const year = currentDate.getFullYear().toString().substr(2, 2);

      const formattedDate = `${month}${day}${year}`;
      this.requestNumber = randomString.toUpperCase() + formattedDate;
    },

    formatTimeTo12Hour(time) {
      let date;

      if (typeof time === "string") {
        const timeWithDate = `1970-01-01T${time}`;
        const parsedDate = new Date(timeWithDate);
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid time input:", time);
          return "Invalid Time";
        }
        date = parsedDate;
      } else if (time instanceof Date) {
        date = time;
      } else {
        console.error("Invalid time type:", time);
        return "Invalid Time";
      }

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = String(minutes).padStart(2, "0");

      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    },

    async fetchReasonOptions() {
      try {
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL +
          `api/v2/reasons?limit=50&offset=0&sortField=r.id&sortOrder=DESC`;

        const response = await axios.get(api, { headers });

        this.reasonOptions = response.data.data
          .filter((item) => item.code == "attendance_correction")
          .map((item) => ({
            id: item.id,
            type: item.type,
            content: item.content,
          }));
      } catch (error) {
        console.error("Error fetching reason options:", error);
      }
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

    navigateToRecent() {
      this.$router.push("/suysing_viewrecentattendancecorrection");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
p {
  margin: 0;
}

.flex-h {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.text-center {
  text-align: center;
}
.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.card ion-card-header {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.card ion-card-header ion-card-subtitle {
  border: 1px solid gray;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px 0 0 0;
}
.card-content {
  padding: 0 0 0 20px;
}
.card h5 {
  margin: 0;
}
.result-container {
  max-width: 400px;
  margin: 0 auto;
}
.payroll-container {
  width: fit-content;
  min-width: 305px;
  height: fit-content;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
}
.wdays-text {
  color: #000;
  text-align: center;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.box {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: #6d2b84;
}
.wdays-num {
  color: #fff;
  text-align: center;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.select-option {
  border-radius: 20px;
  margin: 5px auto;
  width: fit-content;
}
.input-container {
  display: flex;
  flex-direction: row;
  min-width: 300px;
}
.header-row {
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
}
.outlineColor {
  border-radius: 20px;
}
.pos-right {
  float: right;
  right: 10px;
}
.search-btn-container {
  height: 30px;
  width: 100px;
}
.edit-btn {
  width: 100%;
  height: 30px;
  margin: 0 auto 5px auto;
}
.result-text {
  margin: 15px;
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

.label {
  font-family: "Inter";
  font-weight: bold;
}
.container-inner p {
  padding-left: 20px;
}
.card-container {
  width: 350px;
  margin: 10px auto;
}
.header-outline {
  border-radius: 20px 0 0 20px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  width: fit-content;
}
.header-label {
  color: #fff;
  font-size: 12px;
}
.data-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 200px;
}
.form-title {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  text-align: center;
}
.comment-container {
  width: 100%;
  min-height: 150px;
  padding: 5px 10px;
}
.input-date {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 5px;
  border-radius: 10px;
}
.recent-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  max-width: 500px;
  margin-bottom: 50px;
}
.recent-container h5 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.recent-btn {
  width: 100px;
  border-radius: 10px;
  padding: 0;
  height: 30px;
}
.submit-btn {
  border-radius: 5px;
  padding: 0;
  height: 30px;
}
.reason-select {
  width: 120px;
}
.modal-content {
  margin: 0 0 10px 0;
  text-align: center;
}
#modal {
  --background: rgba(255, 0, 0, 0);
}
.modal-header {
  text-align: center;
}
.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin-top: 50%;
}
</style>
