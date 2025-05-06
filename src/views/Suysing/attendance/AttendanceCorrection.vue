<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <ion-card class="neomorphic-card-1 search-container">
        <ion-item>
          <ion-input
            type="date"
            v-model="selectedDate"
            display-format="YYYY-MM-DD"
            class="neomorphic-input-2 date-input"
          ></ion-input>
        </ion-item>
        <ion-segment v-model="withAttendance" @ionChange="toggleAttendance">
          <ion-segment-button :value="false">
            <p class="segment-label">With Attendance</p>
          </ion-segment-button>
          <ion-segment-button :value="true">
            <p class="segment-label">Without Attendance</p>
          </ion-segment-button>
        </ion-segment>
      </ion-card>
      <div class="recent-container">
        <h5 :style="{ color: theme.primaryColor }">Recent Transaction</h5>
        <ion-button
          expand="full"
          color="None"
          class="recent-btn neomorphic-btn-2"
          @click="navigateToRecent()"
          :style="{
            outline: `2px solid ${theme.primaryColor}`,
            color: theme.primaryColor,
          }"
        >
          View All
        </ion-button>
      </div>

      <div class="result-container">
        <div v-for="(result, index) in results" :key="index">
          <ion-card class="neomorphic-card-1 card-container" v-if="hasSearched">
            <ion-grid class="grid-container">
              <div class="card-header">
                <h5 class="form-title" :style="{ color: theme.primaryColor }">
                  {{ result.date }}
                </h5>
                <ion-button
                  class="edit-btn"
                  @click="openEditModal(result)"
                  size="small"
                  fill="outline"
                >
                  Edit
                </ion-button>
              </div>
            </ion-grid>
          </ion-card>
        </div>
      </div>

      <!-- Edit Modal -->
      <ion-modal :is-open="isEditing" id="modal">
        <ion-card class="card-modal">
          <ion-card-header>
            <ion-card-title class="modal-header">
              Edit Attendance
              <ion-icon
                name="close"
                class="close-btn"
                @click="closeEditModal"
              ></ion-icon>
            </ion-card-title>
          </ion-card-header>

          <ion-grid class="modal-content">
            <ion-row class="data-container">
              <ion-col size="6">
                <p><strong>Request No:</strong></p>
              </ion-col>
              <ion-col size="6">
                {{ this.requestNumber }}
              </ion-col>
            </ion-row>

            <ion-row class="data-container">
              <ion-col size="6">
                <p><strong>Actual In:</strong></p>
              </ion-col>
              <ion-col size="6">
                <input
                  v-model="selectedResult.actualIn"
                  type="time"
                  class="neomorphic-card-1 input-date"
                />
              </ion-col>
            </ion-row>

            <ion-row class="data-container">
              <ion-col size="6">
                <p><strong>Actual Out:</strong></p>
              </ion-col>
              <ion-col size="6">
                <input
                  v-model="selectedResult.actualOut"
                  type="time"
                  class="neomorphic-card-1 input-date"
                />
              </ion-col>
            </ion-row>

            <ion-row class="data-container">
              <ion-col size="6">
                <p><strong>Reason:</strong></p>
              </ion-col>
              <ion-col size="6">
                <ion-select
                  placeholder="Select Reason"
                  v-model="selectedReason"
                  class="reason-select neomorphic-input-2"
                  aria-label="Reason"
                >
                  <ion-select-option
                    v-for="option in reasonOptions"
                    :key="option.value"
                    :value="option.content"
                  >
                    {{ option.content }}
                  </ion-select-option>
                </ion-select>
              </ion-col>
            </ion-row>

            <ion-row class="data-container">
              <ion-col size="6">
                <p><strong>Comment:</strong></p>
              </ion-col>
              <ion-col size="6"> </ion-col>
            </ion-row>

            <ion-row class="data-container">
              <ion-col size="12">
                <textarea
                  name="comment"
                  v-model="comment"
                  class="comment-container neomorphic-textarea-1"
                  placeholder="Enter comment here..."
                ></textarea>
              </ion-col>
            </ion-row>

            <ion-row class="data-container">
              <ion-button
                expand="full"
                class="submit-btn neomorphic-btn-2"
                color="none"
                :style="{ backgroundColor: theme.primaryColor }"
                @click="saveCorrection"
              >
                Submit
              </ion-button>
            </ion-row>
          </ion-grid>
        </ion-card>
      </ion-modal>

      <!-- Success Modal -->
      <ion-modal :is-open="isSuccessful" id="success-modal">
        <ion-card class="card-modal">
          <ion-card-header>
            <ion-card-title class="modal-header">
              Success
              <ion-icon
                name="checkmark-circle"
                :style="{ color: theme.successColor }"
                class="close-btn"
              ></ion-icon>
            </ion-card-title>
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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
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
    IonSegment,
    IonSegmentButton,
    IonInput,
    IonLabel,
    IonItem,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Attendance",
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
      requestNumber: "",
      isSuccessful: false,
      withAttendance: false,
      isEditing: false,
      selectedResult: {},
      withAttendance: false,
      selectedDate: "",
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

    async toggleAttendance(event) {
      this.withAttendance = event.detail.value;
      await this.fetchData();
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

        let api =
          baseURL +
          `api/v2/daily-logs?limit=50&offset=0&noAttendance=${this.withAttendance}`;

        if (this.selectedDate) {
          api += `&date=${this.selectedDate}`;
        }

        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((period) => ({
            id: period.id,
            date: period.date,
            day: period.day,
            actualIn: period.actualIn,
            actualOut: period.actualOut,
            previousIn: period.previousActualIn,
            previousOut: period.previousActualOut,
            isEditing: false,
          }));
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

        // Validate required fields
        if (
          !this.selectedResult.actualIn ||
          !this.selectedResult.actualOut ||
          !this.comment ||
          !this.selectedReason
        ) {
          const toast = await toastController.create({
            message: "Please complete all input fields.",
            duration: 3000,
            position: "top",
            icon: "alert-circle-outline",
            buttons: [{ icon: "close-outline", role: "cancel" }],
          });
          await toast.present();
          return;
        }

        // Format time
        const applyActualIn = this.convertTo24Hour(
          this.selectedResult.actualIn
        );
        const applyActualOut = this.convertTo24Hour(
          this.selectedResult.actualOut
        );

        // Prepare payload
        const payload = {
          requestNo: this.requestNumber,
          applyActualIn,
          applyActualOut,
          comment: this.comment,
          reason: this.selectedReason,
          date: this.startDate,
          empNumber: empNumber,
          previousIn: this.selectedResult.previousIn,
          previousOut: this.selectedResult.previousOut,
        };

        // Send request
        const dataResponse = await axios.post(api, payload, { headers });

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.isSuccessful = true;
          this.isEditing = false;
        } else {
          throw new Error(
            "Error occurred while sending attendance correction."
          );
        }
      } catch (error) {
        console.error(error);
        const errorMessage =
          error.response?.data?.error?.message ||
          "An unexpected error occurred.";

        const toast = await toastController.create({
          message: errorMessage,
          duration: 3000,
          position: "top",
          icon: "alert-circle-outline",
          buttons: [{ icon: "close-outline", role: "cancel" }],
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
        .map(() => Math.random().toString(36)[2].toUpperCase()) // Make it uppercase
        .join("");
    },

    requestNumberGenerator() {
      const randomString = `${this.generateRandomString(
        2
      )}-${this.generateRandomString(2)}-${this.generateRandomString(3)}`;

      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      const year = currentDate.getFullYear().toString().substr(2, 2);
      const formattedDate = `${year}${month}${day}`;

      this.requestNumber = `${formattedDate}-${randomString}`;
    },

    convertTo24Hour(time) {
      if (!time) return "";

      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":");

      if (modifier === "PM" && hours !== "12") {
        hours = String(Number(hours) + 12);
      } else if (modifier === "AM" && hours === "12") {
        hours = "00";
      }

      return `${hours.padStart(2, "0")}:${minutes}`;
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

    toggleEdit(index) {
      this.results[index].isEditing = !this.results[index].isEditing;
    },

    openEditModal(result) {
      this.requestNumberGenerator();
      if (result.actualIn) {
        this.selectedResult = {
          ...result,
          actualIn: this.convertTo24Hour(result.actualIn),
          actualOut: this.convertTo24Hour(result.actualOut),
          previousIn: this.convertTo24Hour(result.actualIn),
          previousOut: this.convertTo24Hour(result.actualOut),
        };
      } else {
        this.selectedResult = { ...result };
      }
      this.isEditing = true;
      console.log(result);
    },
    closeEditModal() {
      this.isEditing = false;
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
  width: 200px;
  height: 30px;
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
  width: 300px;
  margin: 20px auto;
}
.grid-container {
  display: flex;
  justify-content: center;
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
  text-align: left;
}
.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 200px;
  margin: 0 auto;
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
  margin: 0 auto 0 auto;
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
.close-btn {
  border: 2px solid black;
  border-radius: 100%;
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
  margin: 20px auto;
  width: 150px;
}
.reason-select {
  width: 100%;
}
.modal-content {
  margin: 0 0 10px 0;
  text-align: center;
  padding: 0 20px;
}
#modal {
  --background: rgba(255, 0, 0, 0);
}
.modal-header {
  display: flex;
  justify-content: space-between;
}
.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin: auto 10px;
}
.segment-label {
  font-size: 12px;
}
</style>
