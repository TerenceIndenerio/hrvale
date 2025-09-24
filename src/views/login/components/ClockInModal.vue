<template>
  <ion-modal
    v-if="this.isFinishedLoading"
    :is-open="isOpen"
    @didDismiss="$emit('didDismiss')"
    class="clock-modal"
    :backdrop-dismiss="false"
  >
    <ion-header class="clock-modal-header">
      <ion-toolbar class="clock-toolbar">
        <ion-buttons slot="end">
          <ion-button @click="$emit('didDismiss')" color="primary">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="clock-modal-title">
          <ion-icon name="time-outline" class="modal-title-icon"></ion-icon>
          Clock In / Out
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="clock-modal-content" v-if="!loading">
      <Refresher />
      <div>
        <div v-if="scannedUsername && scannedName" class="user-info-card">
          <p><strong>Username:</strong> {{ scannedUsername }}</p>
          <p><strong>Name:</strong> {{ scannedName }}</p>
        </div>
        <ClockinCard
          @clockInClicked="handleClockInData"
          :btnText="btnText"
          :btnColor="theme.primaryColor"
          :btnTextColor="theme.primaryFontColor"
          class="clock-card"
        />

        <ion-card class="reminder-card">
          <ion-card-content class="reminder-content">
            <ion-icon
              name="information-circle-outline"
              color="warning"
              slot="start"
            ></ion-icon>

            Reminder: Punch out will not show unless you completed break punch
            in and out
          </ion-card-content>
        </ion-card>

        <!-- Button to open modal -->
        <ion-button
          class="break-details-btn"
          color="primary"
          expand="block"
          @click="openModal"
        >
          <ion-icon name="reader-outline" slot="start"></ion-icon>
          View Break Details
        </ion-button>
      </div>

      <!-- Modal for Break Details -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header :style="{ backgroundColor: theme.primaryColor }">
          <ion-toolbar>
            <ion-title>
              Break Details
              <ion-icon name="reader-outline"></ion-icon>
            </ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list v-if="breakDetails">
            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >AM Break In:</strong
                >
                <p>
                  {{ breakDetails.punchInAmBreak.amTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >AM Break Out:</strong
                >
                <p>
                  {{ breakDetails.punchOutAmBreak.amTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >Lunch In:</strong
                >
                <p>
                  {{ breakDetails.punchInLunchBreak.lunchTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >Lunch Out:</strong
                >
                <p>
                  {{ breakDetails.punchOutLunchBreak.lunchTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >PM Break In:</strong
                >
                <p>
                  {{ breakDetails.punchInPmBreak.pmTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >PM Break Out:</strong
                >
                <p>
                  {{ breakDetails.punchOutPmBreak.pmTime || "" }}
                </p>
              </ion-label>
            </ion-item>
          </ion-list>

          <h4 v-else class="No-data-break-details">
            <strong>No Data</strong>
          </h4>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-modal>
</template>

<script>
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  toastController,
  alertController,
  IonCard,
  IonCardContent,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";
import Refresher from "@/components/refresher/Refresher.vue";
import ClockinCard from "@/views/services/clock_in/components/ClockinCard.vue";

export default defineComponent({
  name: "ClockInModal",
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    Refresher,
    ClockinCard,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    scannedUsername: {
      type: String,
      required: true,
    },
    scannedName: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      btnText: "",
      headerTitle: "Clock In/Out",
      clockin: "00:00",
      clockout: "00:00",
      date: "",
      time: "",
      timezoneName: "",
      timezoneOffset: "",
      employeeAlreadyPunchedIn: false,
      theme: {},
      loading: true,
      coordinatesText: "",
      toastMessage: "",
      hasClockedIn: false,
      breakTime: false,
      breakDetails: null,
      isModalOpen: false,
      hasBreaktime: false,
      isFinishedLoading: false,
    };
  },
  watch: {
    isOpen: {
      async handler(val) {
        if (val) {
          // Modal opened
          this.loading = true;
          await this.initializeClock();
          this.loading = false;
        } else {
          // Modal closed
          this.isFinishedLoading = false; // ✅ Reset
        }
      },
      immediate: true,
    },
  },

  methods: {
    async initializeClock() {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        this.coordinatesText = `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`;
      } catch (error) {
        console.error("Error getting coordinates:", error.message);
        await this.presentGpsErrorAlert();
        this.$emit("didDismiss");
        return;
      }

      this.getCurrentTime();
      setInterval(this.getCurrentTime, 1000);
      await this.checkTokenExpiration();
      await this.updateClockState();
      this.fetchTheme();
      this.isFinishedLoading = true;
    },

    async updateClockState() {
      this.store.commit("loader/updateLoader", true);
      try {
        const empNumber = localStorage.getItem("empNumber");
        const baseURL = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        if (!token || !empNumber || !baseURL) {
          console.error("Missing token, empNumber, or baseURL");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // 1. Check for break time configuration
        const breakConfigUrl = `${baseURL}api/v1/attendance/break-time-config?empNumber=${empNumber}`;
        const breakConfigResponse = await axios.get(breakConfigUrl, {
          headers,
        });

        console.log("Break Config Response:", breakConfigResponse.data);

        this.hasBreaktime = breakConfigResponse.data?.data?.hasBreaktime;

        // 2. Based on config, check the appropriate state
        if (this.hasBreaktime) {
          // Logic for when user has a break schedule
          const breakStateUrl = `${baseURL}api/v1/attendance/break-time/latest?empNumber=${empNumber}`;
          const breakStateResponse = await axios.get(breakStateUrl, {
            headers,
          });
          const breakData = breakStateResponse.data.data;
          const currentDate = new Date().toISOString().split("T")[0];

          if (
            breakData.punchInAmBreak.amDate === currentDate ||
            breakData.punchOutAmBreak.amDate === currentDate ||
            breakData.punchInLunchBreak.lunchDate === currentDate ||
            breakData.punchOutLunchBreak.lunchDate === currentDate ||
            breakData.punchInPmBreak.pmDate === currentDate ||
            breakData.punchOutPmBreak.pmDate === currentDate
          ) {
            this.breakDetails = breakData;
          } else {
            this.breakDetails = null;
          }

          if (breakData.state.name === "Punched In") {
            this.btnText = "Punch Out Break";
            this.toastMessage = "Punch Out Break";
          } else {
            this.btnText = "Punch In Break";
            this.toastMessage = "Punch In Break";
          }
        } else {
          // Logic for standard attendance
          const attendanceStateUrl = `${baseURL}api/v2/attendance/records/latest?empNumber=${empNumber}`;
          const attendanceStateResponse = await axios.get(attendanceStateUrl, {
            headers,
          });
          const attendanceData = attendanceStateResponse.data?.data;

          this.clockin = attendanceData?.punchIn?.userTime || "00:00";
          this.clockout = attendanceData?.punchOut?.userTime || "00:00";

          const currentDate = new Date().toISOString().split("T")[0];
          if (attendanceData?.punchIn?.userDate !== currentDate)
            this.clockin = "00:00";
          if (attendanceData?.punchOut?.userDate !== currentDate)
            this.clockout = "00:00";

          if (attendanceData?.state?.name === "Punched Out") {
            this.btnText = "Clock In";
            this.toastMessage = "Clocked Out";
            this.employeeAlreadyPunchedIn = false;
          } else {
            // Assumes "Punched In" or other states mean they can clock out
            this.btnText = "Clock Out";
            this.toastMessage = "Clocked In";
            this.employeeAlreadyPunchedIn = true;
          }
        }
      } catch (error) {
        console.error("Error updating clock state:", error);
        const errorMessage =
          error.response?.data?.error?.message ||
          "Could not update clock status.";
        this.showErrorMessage(errorMessage);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async presentGpsErrorAlert() {
      const alert = await alertController.create({
        header: "GPS Error",
        message: "Could not retrieve location. Please ensure GPS is enabled.",
        buttons: ["OK"],
      });
      await alert.present();
    },
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("Token not available.");
        return;
      }

      const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() > expirationTime) {
        console.log("Token expired.");
        const alert = await alertController.create({
          header: "Session Expired",
          message: "Your session has expired. Please log in again.",
          buttons: ["OK"],
        });
        await alert.present();
        this.$emit("didDismiss");
      }
    },
    getCurrentTime() {
      try {
        const currentTime = new Date();
        const timezoneName = "Asia/Manila";
        const timezoneOffset = currentTime.getTimezoneOffset() / 60;

        const localDateString = `${currentTime.getFullYear()}-${String(
          currentTime.getMonth() + 1
        ).padStart(2, "0")}-${String(currentTime.getDate()).padStart(2, "0")}`;

        const localTimeString = `${String(currentTime.getHours()).padStart(
          2,
          "0"
        )}:${String(currentTime.getMinutes()).padStart(2, "0")}`;

        this.date = localDateString;
        this.time = localTimeString;
        this.timezoneName = timezoneName;
        this.timezoneOffset = timezoneOffset;
      } catch (error) {
        console.error("Error fetching current time:", error.message);
      }
    },
    async handleClockInData() {
      try {
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const coordinates = await Geolocation.getCurrentPosition(); // Re-check for GPS just in case.

        if (this.hasBreaktime) {
          const payload = {
            date: this.date,
            time: this.time,
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
          };
          const breakTimeApiUrl = `${baseURL}api/v1/break-time`;
          await axios.post(breakTimeApiUrl, payload, { headers });
        } else {
          const payload = {
            date: this.date,
            time: this.time,
            timezoneName: this.timezoneName,
            timezoneOffset: this.timezoneOffset,
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
          };
          const attendanceApiUrl = `${baseURL}api/v3/attendance/employees/records`;
          if (this.employeeAlreadyPunchedIn) {
            await axios.put(attendanceApiUrl, payload, { headers });
          } else {
            await axios.post(attendanceApiUrl, payload, { headers });
          }
        }
        this.showAlert(this.toastMessage);
        await this.updateClockState(); // Refresh the state after action
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.message || "An unknown error occurred.";
        console.error("Error making the API request: ", errorMessage);
        this.showErrorMessage(errorMessage);
      }
    },
    async showAlert(message) {
      try {
        const toast = await toastController.create({
          message: `Successfully ${message}!`,
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
      } catch (error) {
        console.log(error.message);
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
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
    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");
      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};
      this.theme = themeData;
      document.documentElement.style.setProperty(
        "--ion-color-primary",
        "#008e9c"
      );
      document.documentElement.style.setProperty(
        "--ion-color-primary-contrast",
        "#ffffff"
      );
    },
  },
  created() {
    this.fetchTheme();
  },
  beforeDestroy() {
    clearInterval(this.updateInterval);
  },
});
</script>

<style scoped>
.reminder-content {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
}
.reminder-card {
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: fit-content;
  margin: 0 auto;
}
.break-details-btn {
  width: fit-content;
  height: 40px;
  margin: 20px auto;
}
</style>
