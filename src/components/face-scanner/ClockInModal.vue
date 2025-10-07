<template>
  <ion-modal
    v-if="isFinishedLoading"
    :is-open="isOpen"
    @didDismiss="handleModalDismiss"
    class="clock-modal"
    :backdrop-dismiss="false"
  >
    <!-- Success Modal (overlays on top) -->
    <ion-modal
      :is-open="showSuccessModal"
      @didDismiss="closeSuccessModal"
      class="success-modal"
      :backdrop-dismiss="false"
    >
      <div class="success-modal-content">
        <div class="success-icon">
          <ion-icon name="checkmark-circle" color="success"></ion-icon>
        </div>
        <h2 class="success-title">Successfully Clocked In!</h2>
        <div class="employee-success-info">
          <h3 class="employee-success-name">{{ employeeInfo.fullName }}</h3>
          <p class="employee-success-position">{{ employeeInfo.jobTitle }}</p>
          <div class="time-in-display">
            <ion-icon name="time-outline"></ion-icon>
            <span>Time In: {{ displayTimes.clockIn }}</span>
          </div>
        </div>
        <ion-button
          @click="closeSuccessModal"
          expand="block"
          class="success-close-btn"
        >
          Continue
        </ion-button>
      </div>
    </ion-modal>

    <!-- Header -->
    <ion-header class="clock-modal-header">
      <ion-toolbar class="clock-toolbar">
        <ion-title class="clock-modal-title">
          <ion-icon name="time-outline" class="modal-title-icon"></ion-icon>
          Clock In / Out
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleModalDismiss" color="primary">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content class="clock-modal-content" v-if="!loading">
      <Refresher />

      <div class="content-wrapper">
        <!-- Employee Info Card -->
        <ion-card class="employee-card">
          <ion-card-content class="employee-card-content">
            <div class="employee-avatar">
              <ion-icon name="person-circle"></ion-icon>
            </div>
            <h2 class="employee-name">{{ employeeInfo.fullName }}</h2>
            <p class="employee-position">{{ employeeInfo.jobTitle }}</p>
            <div class="employee-badges">
              <span class="badge">
                <ion-icon name="card-outline"></ion-icon>
                {{ employeeInfo.employeeId }}
              </span>
              <span class="badge">
                <ion-icon name="location"></ion-icon>
                {{ employeeInfo.locations }}
              </span>
            </div>
            <!-- GPS Status Indicator -->

            <!-- <div
              class="gps-status"
              v-if="locationStatus"
              @click="toggleLocationDetails"
            >
              <ion-icon
                :name="
                  locationStatus === 'success' ? 'location' : 'location-outline'
                "
                :color="locationStatus === 'success' ? 'success' : 'warning'"
              ></ion-icon>
              <span>{{ locationMessage }}</span>
              <ion-icon
                :name="showLocationDetails ? 'chevron-up' : 'chevron-down'"
                class="toggle-icon"
              ></ion-icon>
            </div> -->

            <!-- Location Details Container -->
            <!-- <div
              class="location-container"
              v-if="locationStatus && showLocationDetails"
            >
              <div class="location-detail">
                <ion-icon name="navigate-outline"></ion-icon>
                <div>
                  <strong>Latitude:</strong>
                  <span>{{ currentLocation.latitude.toFixed(6) }}</span>
                </div>
              </div>
              <div class="location-detail">
                <ion-icon name="navigate-outline"></ion-icon>
                <div>
                  <strong>Longitude:</strong>
                  <span>{{ currentLocation.longitude.toFixed(6) }}</span>
                </div>
              </div>
            </div> -->
          </ion-card-content>
        </ion-card>

        <!-- Clock Out Button (Only shown when user is clocked in) -->
        <ClockInCardDigital
          v-if="isPunchedIn"
          @clockInClicked="handleClockAction"
          :btnText="buttonText"
          :btnColor="theme.primaryColor"
          :btnTextColor="theme.primaryFontColor"
        />

        <!-- Time Display Card -->
        <ion-card class="time-card">
          <ion-card-content class="time-card-content">
            <div class="time-row">
              <div class="time-item">
                <ion-icon name="log-in-outline" class="time-icon"></ion-icon>
                <p class="time-label">Time In</p>
                <p class="time-value">{{ displayTimes.clockIn }}</p>
              </div>
              <div class="time-divider"></div>
              <div class="time-item">
                <ion-icon name="log-out-outline" class="time-icon"></ion-icon>
                <p class="time-label">Time Out</p>
                <p class="time-value">{{ displayTimes.clockOut }}</p>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Break Section -->
        <div v-if="hasBreaktime" class="break-section">
          <ion-button
            class="break-btn"
            color="primary"
            fill="outline"
            @click="openBreakDetailsModal"
          >
            <ion-icon name="cafe-outline" slot="start"></ion-icon>
            View Break Details
          </ion-button>
          <div class="break-reminder">
            <ion-icon name="information-circle"></ion-icon>
            <span>Complete all breaks before clocking out</span>
          </div>
        </div>
      </div>

      <!-- Break Details Modal -->
      <ion-modal
        :is-open="isBreakModalOpen"
        @didDismiss="closeBreakDetailsModal"
      >
        <ion-header :style="{ backgroundColor: theme.primaryColor }">
          <ion-toolbar>
            <ion-title>Break Details</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeBreakDetailsModal">
                <ion-icon name="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list v-if="breakDetails">
            <ion-item
              v-for="breakItem in formattedBreakDetails"
              :key="breakItem.label"
            >
              <ion-icon
                slot="start"
                name="time-outline"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong>{{ breakItem.label }}</strong>
                <p>{{ breakItem.time || "Not recorded" }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <div v-else class="no-data">
            <ion-icon name="document-outline"></ion-icon>
            <p>No break data available</p>
          </div>
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
  IonCard,
  IonCardContent,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import Refresher from "@/components/refresher/Refresher.vue";
import ClockinCard from "@/views/services/clock_in/components/ClockinCard.vue";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import ClockInCardDigital from "@/views/services/clock_in/components/ClockInCardDigital.vue";
import { Geolocation } from "@capacitor/geolocation";

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
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    Refresher,
    ClockinCard,
    ClockInCardDigital,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    scannedEmployeeDetails: {
      type: Object,
      default: null,
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
      loading: true,
      isFinishedLoading: false,
      isBreakModalOpen: false,
      showSuccessModal: false,
      successModalTimeout: null,
      employeeInfo: {
        employeeNumber: "",
        employeeId: "",
        fullName: "",
        firstName: "",
        lastName: "",
        middleName: "",
        position: "",
        username: "",
        jobTitle: "",
        locations: "",
      },
      buttonText: "",
      displayTimes: {
        clockIn: "00:00",
        clockOut: "00:00",
      },
      isPunchedIn: false,
      hasBreaktime: false,
      breakDetails: null,
      theme: {},
      baseURL: "https://hrp-uat-app.bapplware.com/web/index.php",
      idleTimeout: null,
      currentLocation: {
        latitude: 0,
        longitude: 0,
      },
      locationStatus: null, // 'success', 'error', 'requesting'
      locationMessage: "",
      showLocationDetails: false,
    };
  },
  computed: {
    formattedBreakDetails() {
      if (!this.breakDetails) return [];
      return [
        {
          label: "AM Break In",
          time: this.breakDetails.punchInAmBreak?.amTime || "",
        },
        {
          label: "AM Break Out",
          time: this.breakDetails.punchOutAmBreak?.amTime || "",
        },
        {
          label: "Lunch In",
          time: this.breakDetails.punchInLunchBreak?.lunchTime || "",
        },
        {
          label: "Lunch Out",
          time: this.breakDetails.punchOutLunchBreak?.lunchTime || "",
        },
        {
          label: "PM Break In",
          time: this.breakDetails.punchInPmBreak?.pmTime || "",
        },
        {
          label: "PM Break Out",
          time: this.breakDetails.punchOutPmBreak?.pmTime || "",
        },
      ];
    },
  },
  watch: {
    isOpen: {
      async handler(val) {
        if (val) {
          this.startIdleTimer();
          window.addEventListener("mousemove", this.resetIdleTimer);
          window.addEventListener("keydown", this.resetIdleTimer);
          window.addEventListener("touchstart", this.resetIdleTimer);

          this.loading = true;
          await this.initializeModal();
          this.loading = false;
          await this.speakMessage(
            `${this.getGreeting()} ${this.employeeInfo.firstName}`
          );
        } else {
          this.clearIdleTimer();
          window.removeEventListener("mousemove", this.resetIdleTimer);
          window.removeEventListener("keydown", this.resetIdleTimer);
          window.removeEventListener("touchstart", this.resetIdleTimer);

          this.isFinishedLoading = false;
        }
      },
      immediate: true,
    },
    scannedEmployeeDetails: {
      handler(newVal) {
        if (newVal) {
          this.loadScannedEmployeeInfo(newVal);
        }
      },
      immediate: true,
    },
  },
  beforeUnmount() {
    this.clearIdleTimer();
    if (this.successModalTimeout) {
      clearTimeout(this.successModalTimeout);
    }
    window.removeEventListener("mousemove", this.resetIdleTimer);
    window.removeEventListener("keydown", this.resetIdleTimer);
    window.removeEventListener("touchstart", this.resetIdleTimer);
  },
  methods: {
    async initializeModal() {
      // Get GPS location first
      // await this.getCurrentLocation();

      if (this.scannedEmployeeDetails) {
        this.loadScannedEmployeeInfo(this.scannedEmployeeDetails);
      } else {
        this.loadLocalEmployeeInfo();
      }
      this.fetchTheme();
      await this.fetchClockState();

      // Auto clock in if user is not already clocked in
      if (!this.isPunchedIn) {
        await this.autoClockIn();
      }

      this.isFinishedLoading = true;
    },

    async getCurrentLocation() {
      try {
        this.locationStatus = "requesting";
        this.locationMessage = "Getting location...";

        // Check and request permissions
        const permission = await Geolocation.checkPermissions();

        if (permission.location !== "granted") {
          const requestResult = await Geolocation.requestPermissions();
          if (requestResult.location !== "granted") {
            throw new Error("Location permission denied");
          }
        }

        // Get current position with high accuracy
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });

        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        this.locationStatus = "success";
        this.locationMessage = "Location acquired";

        console.log("Location acquired:", this.currentLocation);
      } catch (error) {
        console.error("Error getting location:", error);

        this.locationStatus = "error";
        this.locationMessage = "Location unavailable";

        // Fallback to default coordinates (0, 0)
        this.currentLocation = {
          latitude: 0,
          longitude: 0,
        };

        // Show warning toast
        // await this.showWarningToast(
        //   "Unable to get GPS location. Using default coordinates."
        // );
      }
    },

    loadScannedEmployeeInfo(data) {
      const employee = data.employee || {};
      this.employeeInfo = {
        employeeNumber: employee.empNumber || "",
        employeeId: employee.employeeId || "",
        firstName: employee.firstName || "",
        middleName: employee.middleName || "",
        lastName: employee.lastName || "",
        fullName: this.formatFullName(
          employee.firstName,
          employee.middleName,
          employee.lastName
        ),
        position: data.userRole?.displayName || data.userRole?.name || "N/A",
        username: data.userName || "",
        jobTitle: employee.jobTitle?.title || "N/A",
        locations: employee.locations?.[0]?.name || "N/A",
      };
    },

    loadLocalEmployeeInfo() {
      const firstName = localStorage.getItem("firstName") || "";
      const middleName = localStorage.getItem("middleName") || "";
      const lastName = localStorage.getItem("lastName") || "";
      this.employeeInfo = {
        employeeNumber: localStorage.getItem("empNumber") || "",
        employeeId: localStorage.getItem("employeeId") || "",
        firstName,
        middleName,
        lastName,
        fullName: this.formatFullName(firstName, middleName, lastName),
        position: localStorage.getItem("position") || "N/A",
        username:
          localStorage.getItem("username") ||
          localStorage.getItem("email") ||
          "",
      };
    },

    formatFullName(firstName, middleName, lastName) {
      const parts = [firstName, middleName, lastName].filter(
        (part) => part && part.trim()
      );
      return parts.join(" ") || "N/A";
    },

    fetchTheme() {
      const storedTheme = localStorage.getItem("themeData");
      this.theme = storedTheme ? JSON.parse(storedTheme) : {};
      document.documentElement.style.setProperty(
        "--ion-color-primary",
        "#008e9c"
      );
      document.documentElement.style.setProperty(
        "--ion-color-primary-contrast",
        "#ffffff"
      );
    },

    getAuthHeaders() {
      const token = localStorage.getItem("token");
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    },

    async fetchClockState() {
      try {
        const empNumber = this.employeeInfo.employeeNumber;
        if (!empNumber) throw new Error("Employee number not found");

        const hasBreak = await this.checkBreaktimeConfig(empNumber);
        if (hasBreak) {
          await this.fetchBreaktimeState(empNumber);
        } else {
          await this.fetchAttendanceState(empNumber);
        }
      } catch (error) {
        console.error("Error fetching clock state:", error);
        await this.showErrorToast(
          error.message || "Could not load clock status"
        );
      }
    },

    async checkBreaktimeConfig(empNumber) {
      try {
        const url = `${this.baseURL}/api/v1/attendance/break-time-config?empNumber=${empNumber}`;
        const response = await axios.get(url, {
          headers: this.getAuthHeaders(),
        });
        this.hasBreaktime = response.data?.data?.hasBreaktime || false;
        return this.hasBreaktime;
      } catch (error) {
        this.hasBreaktime = false;
        return false;
      }
    },

    async fetchBreaktimeState(empNumber) {
      try {
        const url = `${this.baseURL}/api/v1/attendance/break-time/latest?empNumber=${empNumber}`;
        const response = await axios.get(url, {
          headers: this.getAuthHeaders(),
        });
        const breakData = response.data?.data;
        const currentDate = new Date().toISOString().split("T")[0];

        const isToday = [
          breakData?.punchInAmBreak?.amDate,
          breakData?.punchOutAmBreak?.amDate,
          breakData?.punchInLunchBreak?.lunchDate,
          breakData?.punchOutLunchBreak?.lunchDate,
          breakData?.punchInPmBreak?.pmDate,
          breakData?.punchOutPmBreak?.pmDate,
        ].some((date) => date === currentDate);

        this.breakDetails = isToday ? breakData : null;

        const stateName = breakData?.state?.name;

        if (!breakData || !isToday) {
          this.buttonText = "Clock In";
          this.isPunchedIn = false;
          this.displayTimes.clockIn = "00:00";
          this.displayTimes.clockOut = "00:00";
        } else if (stateName === "Punched In") {
          this.buttonText = "Break In";
          this.isPunchedIn = true;
          this.displayTimes.clockIn =
            breakData?.punchInAmBreak?.amTime ||
            breakData?.punchInLunchBreak?.lunchTime ||
            breakData?.punchInPmBreak?.pmTime ||
            "00:00";
          this.displayTimes.clockOut = "00:00";
        } else if (stateName === "Punched Out" || stateName === "Break In") {
          this.buttonText = "Clock Out";
          this.isPunchedIn = true;
          this.displayTimes.clockIn =
            breakData?.punchInAmBreak?.amTime ||
            breakData?.punchInLunchBreak?.lunchTime ||
            breakData?.punchInPmBreak?.pmTime ||
            "00:00";
          this.displayTimes.clockOut = "00:00";
        } else {
          this.buttonText = "Clock In";
          this.isPunchedIn = false;
          this.displayTimes.clockIn = "00:00";
          this.displayTimes.clockOut = "00:00";
        }
      } catch (error) {
        console.error("Error fetching break state:", error);
        throw error;
      }
    },

    async fetchAttendanceState(empNumber) {
      try {
        const url = `${this.baseURL}/api/v3/attendance/employees/records?empNumber=${empNumber}`;
        const response = await axios.get(url, {
          headers: this.getAuthHeaders(),
        });
        const record = response.data?.data[0];
        const currentState = response.data?.meta?.currentState;
        const currentDate = new Date().toISOString().split("T")[0];

        this.displayTimes.clockIn =
          record?.punchIn?.userDate === currentDate
            ? record.punchIn.userTime
            : "00:00";
        this.displayTimes.clockOut =
          record?.punchOut?.userDate === currentDate
            ? record.punchOut.userTime
            : "00:00";

        this.isPunchedIn = currentState?.isCurrentlyPunchedIn || false;
        this.buttonText = this.isPunchedIn ? "Clock Out" : "Clock In";
      } catch (error) {
        console.error("Error fetching attendance state:", error);
        throw error;
      }
    },

    async autoClockIn() {
      try {
        let url, payload;

        if (this.hasBreaktime) {
          url = `${this.baseURL}/api/v1/attendance/break-time`;
          payload = this.buildBreakClockPayload("PUNCH_IN");
        } else {
          url = `${this.baseURL}/api/v3/attendance/employees/records`;
          payload = this.buildClockPayload();
        }

        await axios.post(url, payload, { headers: this.getAuthHeaders() });

        await this.fetchClockState();

        await this.speakMessage("Successfully Clocked In");

        this.showSuccessModal = true;

        this.successModalTimeout = setTimeout(() => {
          this.closeSuccessModal();
        }, 3000);
      } catch (error) {
        console.error("Error auto clocking in:", error);

        const apiError = error.response?.data?.error;
        let errorMessage = "Auto clock in failed";

        if (apiError?.message === "Punch-In Overlap Found") {
          errorMessage = "Employee Already Clock In";
        } else if (apiError?.message) {
          errorMessage = apiError.message;
        }

        await this.showErrorToast(errorMessage);
        await this.speakMessage(`${errorMessage}`);
      }
    },

    async submitClockAction() {
      try {
        // Refresh location before clock action
        // await this.getCurrentLocation();

        let url, payload, successMessage;

        if (this.hasBreaktime) {
          url = `${this.baseURL}/api/v1/attendance/break-time`;

          if (this.buttonText === "Break Out") {
            payload = this.buildBreakClockPayload("PUNCH_IN");
            successMessage = "Break Out";
          } else if (this.buttonText === "Break In") {
            payload = this.buildBreakClockPayload("PUNCH_OUT");
            successMessage = "Break In";
          } else if (this.buttonText === "Clock Out") {
            url = `${this.baseURL}/api/v3/attendance/employees/records`;
            payload = this.buildClockPayload();
            successMessage = "Clocked Out";
          }
        } else {
          url = `${this.baseURL}/api/v3/attendance/employees/records`;
          payload = this.buildClockPayload();
          successMessage = "Clocked Out";
        }

        await axios.post(url, payload, { headers: this.getAuthHeaders() });

        await this.showSuccessToast(successMessage);
        await this.speakMessage(`Successfully ${successMessage}`);
        await this.fetchClockState();
      } catch (error) {
        console.error("Error submitting clock action:", error);

        const apiError = error.response?.data?.error;
        let errorMessage = "An error occurred";

        if (apiError?.message === "Punch-In Overlap Found") {
          errorMessage = "Employee Already Clock In";
        } else if (apiError?.message) {
          errorMessage = apiError.message;
        }

        await this.showErrorToast(errorMessage);
        await this.speakMessage(`${errorMessage}`);
        throw error;
      }
    },

    buildClockPayload() {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const tzOffset = -now.getTimezoneOffset();
      const tzHours = Math.floor(Math.abs(tzOffset) / 60)
        .toString()
        .padStart(2, "0");
      const tzMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, "0");
      const tzSign = tzOffset >= 0 ? "+" : "-";
      const tzString = `UTC${tzSign}${tzHours}:${tzMinutes}`;

      return {
        date: now.toISOString().split("T")[0],
        time: currentTime,
        latitude: null,
        longitude: null,
        timezoneName: tzString,
        timezoneOffset: tzOffset,
      };
    },

    buildBreakClockPayload(action) {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const tzOffset = -now.getTimezoneOffset();
      const tzHours = Math.floor(Math.abs(tzOffset) / 60)
        .toString()
        .padStart(2, "0");
      const tzMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, "0");
      const tzSign = tzOffset >= 0 ? "+" : "-";
      const tzString = `UTC${tzSign}${tzHours}:${tzMinutes}`;

      return {
        empNumber: this.employeeInfo.employeeNumber,
        date: now.toISOString().split("T")[0],
        time: currentTime,
        action: action,
        latitude: null,
        longitude: null,
        timezoneName: tzString,
        timezoneOffset: tzOffset,
      };
    },

    async handleClockAction() {
      try {
        await this.submitClockAction();
      } catch (error) {
        console.error("Clock action failed:", error);
      } finally {
        this.handleModalDismiss();
      }
    },

    handleModalDismiss() {
      this.$emit("didDismiss");
    },

    closeSuccessModal() {
      this.showSuccessModal = false;
      if (this.successModalTimeout) {
        clearTimeout(this.successModalTimeout);
        this.successModalTimeout = null;
      }
    },

    startIdleTimer() {
      this.clearIdleTimer();
      this.idleTimeout = setTimeout(() => {
        this.handleIdle();
      }, 15000);
    },

    resetIdleTimer() {
      this.startIdleTimer();
    },

    clearIdleTimer() {
      if (this.idleTimeout) {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = null;
      }
    },

    handleIdle() {
      this.handleModalDismiss();
    },

    toggleLocationDetails() {
      this.showLocationDetails = !this.showLocationDetails;
    },

    openBreakDetailsModal() {
      this.isBreakModalOpen = true;
    },

    closeBreakDetailsModal() {
      this.isBreakModalOpen = false;
    },

    async showSuccessToast(message) {
      const toast = await toastController.create({
        message: `Successfully ${message}!`,
        duration: 3000,
        position: "top",
        icon: "checkmark-circle-outline",
        color: "success",
        buttons: [{ icon: "close-outline", role: "cancel" }],
        cssClass: "custom-toast",
      });
      await toast.present();
    },

    async showErrorToast(message) {
      const toast = await toastController.create({
        message: message,
        duration: 3000,
        position: "top",
        color: "danger",
        icon: "alert-circle-outline",
        buttons: [{ icon: "close-outline", role: "cancel" }],
      });
      await toast.present();
    },

    async showWarningToast(message) {
      const toast = await toastController.create({
        message: message,
        duration: 4000,
        position: "top",
        color: "warning",
        icon: "warning-outline",
        buttons: [{ icon: "close-outline", role: "cancel" }],
      });
      await toast.present();
    },

    async speakMessage(text) {
      try {
        await TextToSpeech.speak({
          text: text,
          lang: "en-US",
          rate: 1.0,
        });
      } catch (error) {
        console.error("Text-to-speech error:", error);
      }
    },

    getGreeting() {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    },
  },

  created() {
    this.fetchTheme();
  },
});
</script>
<style scoped>
.clock-modal-content {
  --background: transparent;
  background: linear-gradient(
    135deg,
    rgba(0, 142, 156, 0.08) 0%,
    rgba(255, 255, 255, 0.15) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.content-wrapper {
  padding: 16px;
  max-width: 500px;
  margin: 0 auto;
}

/* Employee Card */
.employee-card {
  margin: 0 0 16px 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.employee-card-content {
  padding: 20px !important;
  text-align: center;
}

.employee-avatar {
  margin-bottom: 12px;
}

.employee-avatar ion-icon {
  font-size: 64px;
  color: #3880ff;
}

.employee-name {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #1a1a1a;
}

.employee-position {
  font-size: 15px;
  color: #555;
  margin: 0 0 14px 0;
  font-weight: 500;
}

.employee-badges {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 500;
  background: rgba(0, 142, 156, 0.12);
  color: #3880ff;
}

.badge ion-icon {
  font-size: 16px;
}

/* Time Card */
.time-card {
  margin: 0 0 16px 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.time-card-content {
  padding: 16px !important;
}

.time-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.time-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.time-icon {
  font-size: 36px;
  color: #3880ff;
  margin-bottom: 8px;
}

.time-label {
  font-size: 13px;
  color: #555;
  margin: 0 0 6px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.time-divider {
  width: 1px;
  height: 60px;
  background: rgba(0, 0, 0, 0.12);
}

/* Clock Card */
.clock-card {
  margin: 0 auto 16px auto;
}

/* Break Section */
.break-section {
  text-align: center;
  margin-top: 8px;
}

.break-btn {
  --padding-top: 10px;
  --padding-bottom: 10px;
  height: 40px;
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 500;
}

.break-reminder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #856404;
  margin: 0;
  padding: 10px 16px;
  background: rgba(255, 243, 224, 0.9);
  border-radius: 10px;
}

.break-reminder ion-icon {
  font-size: 18px;
  flex-shrink: 0;
}

/* Break Modal */
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.no-data ion-icon {
  font-size: 64px;
  opacity: 0.3;
  margin-bottom: 16px;
}

.no-data p {
  margin: 0;
  font-size: 15px;
}
/* success modal */
.success-modal {
  --width: 90%;
  --max-width: 400px;
  --height: auto;
  --border-radius: 16px;

  --background: transparent;
  background: linear-gradient(
    135deg,
    rgba(0, 142, 156, 0.08) 0%,
    rgba(255, 255, 255, 0.15) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.success-modal-content {
  padding: 32px 24px;
  text-align: center;
  background: white;
}

.success-icon {
  margin-bottom: 20px;
}

.success-icon ion-icon {
  font-size: 80px;
  color: var(--ion-color-success);
}

.success-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 24px;
}

.employee-success-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.employee-success-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.employee-success-position {
  font-size: 16px;
  color: #6c757d;
  margin-bottom: 16px;
}

.time-in-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-primary);
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.time-in-display ion-icon {
  font-size: 24px;
}

.success-close-btn {
  --background: var(--ion-color-primary);
  --border-radius: 8px;
  font-weight: 600;
  height: 48px;
}

/* global.css or component style */
ion-toast.custom-toast {
  --width: 400px; /* wider toast on desktop */
  --max-width: 90%; /* keep it responsive on mobile */
  --min-height: 60px; /* taller toast */
  --border-radius: 12px; /* nicer corners */
  --font-size: 18px; /* larger text */
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

@media (min-width: 768px) {
  ion-toast.custom-toast {
    --width: 500px;
    --font-size: 20px;
    --min-height: 70px;
  }
}

.gps-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 12px auto 0 auto;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
}

.gps-status:hover {
  background: rgba(0, 0, 0, 0.1);
}

.gps-status ion-icon {
  font-size: 1.2rem;
}

.gps-status .toggle-icon {
  margin-left: auto;
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.location-container {
  margin-top: 8px;
  padding: 12px;
  background: rgba(0, 142, 156, 0.05);
  border-radius: 8px;
  border-left: 3px solid #008e9c;
  animation: slideDown 0.3s ease;
  display: flex;
  flex-direction: column;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.location-detail {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 0.9rem;
}

.location-detail ion-icon {
  color: #008e9c;
  font-size: 1.1rem;
}

.location-detail div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-detail strong {
  font-size: 0.85rem;
  color: #666;
}

.location-detail span {
  font-size: 0.95rem;
  color: #333;
  font-family: monospace;
}
</style>
