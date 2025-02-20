<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />

    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <div class="content-container">
        <!-- Leave Balance Card -->
        <ion-card class="leavebal-card neomorphic-card-1">
          <!-- Leave Balance -->
          <ion-row class="leave-bal">
            <ion-col size="7">
              <strong>
                <p :style="{ color: theme.primaryColor }">Leave Balance:</p>
              </strong>
            </ion-col>
            <ion-col size="4">
              <p :style="{ color: theme.primaryColor }">
                <strong>{{ employeeDetail2.balance }} day(s)</strong>
              </p>
            </ion-col>
          </ion-row>

          <!-- Allocated Days -->
          <ion-row class="leave-bal-detail">
            <ion-col size="7">
              <p>Allocated Days:</p>
            </ion-col>
            <ion-col size="4">
              <p>
                <strong>{{ employeeDetail2.entitled }}</strong>
              </p>
            </ion-col>
          </ion-row>

          <!-- Total Days -->
          <ion-row class="leave-bal-detail">
            <ion-col size="7">
              <p>Total Days:</p>
            </ion-col>
            <ion-col size="4">
              <p>
                <strong>{{ this.valueDates.length }}</strong>
              </p>
            </ion-col>
          </ion-row>
        </ion-card>

        <br />

        <!-- Leave Type Card -->
        <div class="dropdown-container">
          <div class="dropdown">
            <p class="dropdown-label" :style="{ color: theme.primaryColor }">
              Leave Type
            </p>
            <ion-select
              label="Select Leave Type"
              label-placement="floating"
              class="neomorphic-input-2"
              v-model="selectedLeaveType"
              @ionChange="updateSelectedLeave"
            >
              <ion-select-option
                v-for="option in leaveOptionsWithIds"
                :key="option.id"
                :value="option.name"
                class="input-text"
              >
                {{ option.name }}
              </ion-select-option>
            </ion-select>
          </div>

          <!-- Duration -->
          <div class="dropdown" id="duration">
            <p class="dropdown-label" :style="{ color: theme.primaryColor }">
              Duration
            </p>
            <ion-select
              label="Select Duration"
              label-placement="floating"
              v-model="durationSelectedValue"
              class="neomorphic-input-2"
            >
              <ion-select-option
                v-for="duration in durations"
                :key="duration.key"
                :value="duration.key"
              >
                {{ duration.label }}
              </ion-select-option>
            </ion-select>
          </div>
        </div>

        <div class="effective-date-container">
          <p
            class="effective-date-label"
            :style="{ color: theme.primaryColor }"
          >
            Effective Date
          </p>
          <div class="neomorphic-input-2">
            <ion-input
              type="date"
              v-model="effectiveDate"
              @ionChange="handleDateChange"
              class="date-input"
            />
          </div>
        </div>

        <!-- <ion-card class="neomorphic-card-1 calendar-container">
          <Calendar
            :disabledDates="this.disabledDates_"
            @selectedDatesChanged="updateSelectedDates"
          />
        </ion-card> -->

        <ion-card class="neomorphic-card-1 calendar-container">
          <ion-datetime
            presentation="date"
            :multiple="true"
            :value="this.valueDates"
            :highlighted-dates="this.combinedDates"
            @ionChange="handleCalendarChange"
          ></ion-datetime>
        </ion-card>

        <!-- Reason -->
        <div class="reason-container">
          <ion-label :style="{ color: theme.primaryColor }">
            <strong>Reason*</strong>
          </ion-label>
          <ion-card class="reason-select-container neomorphic-input-2">
            <ion-select
              placeholder="Select Reason"
              label-placement="floating"
              v-model="selectedReason"
              class="reason-select"
              aria-label="Reason"
            >
              <div slot="label">Select Reason</div>
              <ion-select-option
                v-for="option in reasonOptions"
                :key="option.value"
                :value="option.content"
              >
                {{ option.content }}
              </ion-select-option>
            </ion-select>
          </ion-card>
        </div>

        <!-- Apply Leave Button -->
        <div class="flex-center btn-container">
          <ion-button
            class="neomorphic-btn-1"
            @click="sendLeaveRequest"
            color="none"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
          >
            Apply Leave
          </ion-button>
        </div>
      </div>

      <!-- alert successfully submitted -->
      <ion-modal :is-open="isSuccessful" id="modal">
        <ion-card class="card-modal">
          <ion-card-header>
            <ion-card-title class="modal-header">Success</ion-card-title>
          </ion-card-header>
          <ion-icon
            name="checkmark-circle"
            :style="{ color: theme.successColor }"
            class="close-btn"
          ></ion-icon>

          <ion-grid class="modal-content">
            <p>Apply Leave Sent Successfully!</p>
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
  IonButton,
  IonSelectOption,
  IonSelect,
  IonTextarea,
  IonToast,
  toastController,
  IonCol,
  IonRow,
  IonLabel,
  IonInput,
  IonDatetime,
  IonModal,
  IonIcon,
  IonCardTitle,
  IonCardHeader,
  IonGrid,
} from "@ionic/vue";
import Calendar from "@/views/services/leave/components/Calendar.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent, ref } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderReturn,
    Refresher,
    IonCard,
    IonButton,
    IonSelectOption,
    IonSelect,
    IonTextarea,
    IonToast,
    toastController,
    Calendar,
    IonCol,
    IonRow,
    IonLabel,
    IonInput,
    IonDatetime,
    IonModal,
    IonIcon,
    IonCardTitle,
    IonCardHeader,
    IonGrid,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      theme: {},
      loading: true,
      headerTitle: "Retract Leave",
      leaveOptionsWithIds: [],
      fromDate: null,
      toDate: null,
      fromTimeDuration: null,
      toTimeDuration: null,
      fromTimeStartDay: null,
      toTimeStartDay: null,
      fromTimeEndDay: null,
      toTimeEndDay: null,
      showDuration: false,
      showDuration2: false,
      showEndDayOnly: false,
      showStartDayOnly: false,
      showsSpecificTime: false,
      showsSpecificTimeEndDay: false,
      showsSpecificTimeStartDay: false,
      partialSelectedValue: null,
      durationSelectedValue: null,
      durationSelectedValue2: null,
      startDaySelectedValue: null,
      endDaySelectedValue: null,
      selectedLeaveType: null,
      selectedLeaveID: null,
      selectedReason: null,
      effectiveDate: null,
      availableBalance: 0,
      leaveRequestId: null,
      hundredDays: [],
      leaveTypeOptions: ["Office Employee", "Sample 100 Days"],
      reasonOptions: [],
      reason: null,
      employeeDetail: { firstName: "-", employeeId: "-" },
      employeeDetail2: { entitled: "- -", balance: "0" },
      hasLeaveType: true,
      durations: [
        { key: "full_day", label: "Full Day" },
        // { key: "half_day", label: "Half Day" },
      ],
      disabledDates_: [],
      selectedDates_: [],
      highlightedDates: [],
      combinedDates: [],
      valueDates: [],
      isSuccessful: false,
    };
  },
  watch: {
    startDaySelectedValue(newVal) {
      this.showsSpecificTimeStartDay = newVal === "specify_time";
    },
    endDaySelectedValue(newVal) {
      this.showsSpecificTimeEndDay = newVal === "specify_time";
    },
    partialSelectedValue(newVal) {
      const options = {
        all: {
          showDuration2: true,
          showStartDayOnly: false,
          showEndDayOnly: false,
          showDuration: false,
        },
        start: {
          showDuration2: false,
          showStartDayOnly: true,
          showDuration: false,
          showEndDayOnly: false,
          showDuration: false,
        },
        end: {
          showDuration2: false,
          showEndDayOnly: true,
          showDuration: false,
          showStartDayOnly: false,
          showDuration: false,
        },
        start_end: {
          showDuration2: false,
          showEndDayOnly: true,
          showDuration: false,
          showStartDayOnly: true,
          showDuration: false,
        },
      };
      const selectedOption = options[newVal] || {};
      Object.assign(this, selectedOption);
    },
    durationSelectedValue(newVal) {
      this.showsSpecificTime = newVal === "specify_time";
    },
  },
  computed: {
    dateDifference() {
      let differenceInDays = this.hundredDays ? this.hundredDays.length : 0;

      if (this.durationSelectedValue === "half_day") {
        differenceInDays *= 0.5;
      } else if (this.durationSelectedValue === "full_day") {
      }

      return differenceInDays;
    },

    showPartialDays() {
      if (this.fromDate && this.toDate) {
        const fromDateObj = new Date(this.fromDate);
        const toDateObj = new Date(this.toDate);
        const fromDay = fromDateObj.setHours(0, 0, 0, 0);
        const toDay = toDateObj.setHours(0, 0, 0, 0);
        const oneDay = 24 * 60 * 60 * 1000;
        const daysDifference = Math.floor((toDay - fromDay) / oneDay);

        this.showDuration = daysDifference === 0;

        return daysDifference > 0;
      }
      return false;
    },
  },

  methods: {
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
          .filter((item) => item.code == "leave")
          .map((item) => ({
            id: item.id,
            type: item.type,
            content: item.content,
          }));
      } catch (error) {
        console.error("Error fetching reason options:", error);
      }
    },

    handleDateChange(event) {
      const selectedDate = event.detail.value;

      const generateDates = (startDate, days) => {
        const dates = [];
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          dates.push({ date: date.toISOString().split("T")[0] });
        }
        return dates;
      };

      const startDate = new Date(selectedDate);
      this.hundredDays = generateDates(startDate, this.employeeDetail2.balance);

      this.combinedDates = [];
      this.valueDates = [];

      let disabledCount = 0;

      this.hundredDays.forEach((day) => {
        const isDisabled = this.disabledDates_.some(
          (disabledDate) => disabledDate.date === day.date
        );
        const textColor = isDisabled ? "white" : "green";
        const backgroundColor = isDisabled ? "lightcoral" : "lightgreen";
        this.combinedDates.push({ ...day, textColor, backgroundColor });

        if (!isDisabled) {
          this.valueDates.push(day.date);
        } else {
          disabledCount++;
        }
      });

      this.disabledDates_.forEach((disabledDate) => {
        const exists = this.combinedDates.some(
          (combinedDate) => combinedDate.date === disabledDate.date
        );
        if (!exists) {
          this.combinedDates.push({
            ...disabledDate,
            textColor: "red",
            backgroundColor: "lightcoral",
          });
        }
      });

      let currentDate = new Date(
        this.hundredDays[this.hundredDays.length - 1].date
      );
      while (disabledCount > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        const extraDateStr = currentDate.toISOString().split("T")[0];
        if (!this.disabledDates_.some((d) => d.date === extraDateStr)) {
          this.valueDates.push(extraDateStr);
          disabledCount--;
        }
      }

      console.log(disabledCount);
    },

    handleCalendarChange(event) {
      // Ensure event.detail.value is an array, default to empty array if undefined
      let selectedDates = Array.isArray(event.detail?.value)
        ? event.detail.value
        : [];

      // Count disabled dates in the selection
      let disabledCount = selectedDates.filter((date) =>
        this.disabledDates_?.some((disabledDate) => disabledDate.date === date)
      ).length;

      // Filter out disabled dates from selection
      this.valueDates = selectedDates.filter((date) => {
        return !this.disabledDates_?.some(
          (disabledDate) => disabledDate.date === date
        );
      });

      // If a disabled date is clicked, prevent further processing
      if (disabledCount > 0 && selectedDates.length > 0) {
        let lastSelectedDate = new Date(
          selectedDates[selectedDates.length - 1]
        );

        while (disabledCount > 0) {
          lastSelectedDate.setDate(lastSelectedDate.getDate() + 1);
          const extraDateStr = lastSelectedDate.toISOString().split("T")[0];

          if (!this.disabledDates_?.some((d) => d.date === extraDateStr)) {
            this.valueDates.push(extraDateStr);
            disabledCount--;
          }
        }
      }
    },
    updateSelectedDates({ selectedDates, month, year }) {
      const generateDates = (startDate, days) => {
        const dates = [];
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          dates.push({ date: date.toISOString().split("T")[0] });
        }
        return dates;
      };

      const startDate = new Date(selectedDates[0]);
      this.hundredDays = generateDates(startDate, 100);

      this.combinedDates = [];

      this.hundredDays.forEach((day) => {
        const isDisabled = this.disabledDates_.some(
          (disabledDate) => disabledDate.date === day.date
        );
        const textColor = isDisabled ? "red" : "green";
        const backgroundColor = isDisabled ? "lightcoral" : "lightgreen";
        this.combinedDates.push({ ...day, textColor, backgroundColor });
      });

      this.disabledDates_.forEach((disabledDate) => {
        const exists = this.combinedDates.some(
          (combinedDate) => combinedDate.date === disabledDate.date
        );
        if (!exists) {
          this.combinedDates.push({
            ...disabledDate,
            textColor: "red",
            backgroundColor: "lightcoral",
          });
        }
      });
    },

    async fetchData() {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          console.error("Token not available.");
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = baseURL + `api/v2/leave/leave-types/eligible`;
        const headers = {
          Authorization: authToken,
        };
        const response = await axios.get(apiUrl, { headers });

        return response.data.data.map((leaveData) => ({
          name: leaveData.name,
          id: leaveData.id,
        }));
      } catch (error) {
        console.error(error.message);
        this.showErrorMessage("No Leave Type!");
        this.hasLeaveType = false;
      } finally {
        this.loading = false;
      }
    },

    async fetchCalendarDisable() {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          console.error("Token not available.");
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const authToken = `Bearer ${storedToken}`;
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: authToken,
        };
        const allDisabledDates = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const years = [currentYear - 1, currentYear, currentYear + 1];

        for (let year of years) {
          const apiUrl = `${baseURL}api/v2/leave/disabledDates?year=${year}`;
          const response = await axios.get(apiUrl, { headers });
          allDisabledDates.push(...response.data.data);
        }

        this.disabledDates_ = allDisabledDates;
        this.disabledDates_.forEach((disabledDate) => {
          const exists = this.combinedDates.some(
            (combinedDate) => combinedDate.date === disabledDate.date
          );
          if (!exists) {
            this.combinedDates.push({
              ...disabledDate,
              textColor: "white",
              backgroundColor: "lightcoral",
            });
          }
        });
      } catch (error) {
        console.error(error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async sendLeaveRequest() {
      try {
        this.store.commit("loader/updateLoader", true);
        if (
          !this.valueDates ||
          !this.valueDates.length ||
          !this.durationSelectedValue ||
          !this.selectedReason ||
          !this.selectedLeaveID
        ) {
          this.showErrorMessage(
            "Invalid Leave request. Please fill in all required fields."
          );
          return;
        }

        const baseURL = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const api = baseURL + "api/v3/leave/leave-requests";

        const requestData = {
          filedDates: this.valueDates,
          duration: this.durationSelectedValue,
          comment: this.selectedReason,
          leaveTypeId: this.selectedLeaveID,
        };

        const response = await axios.post(api, requestData, { headers });

        if (response.status === 200) {
          await this.retractLeaveRequest();
        } else {
          throw new Error(
            "Failed to send leave request. Status: " + response.status
          );
        }

        this.selectedReason = null;
        this.durationSelectedValue = null;
        this.selectedLeaveID = null;
        this.selectedDates_ = null;
      } catch (error) {
        console.error("Error sending leave request:", error);
        this.showErrorMessage(
          error.response?.data?.error?.message || error.message
        );
      } finally {
        this.store.commit("loader/updateLoader", true);
      }
    },

    async retractLeaveRequest() {
      try {
        if (!this.leaveRequestId) {
          this.showErrorMessage(
            "Invalid request. Leave request ID is missing."
          );
          return;
        }

        const baseURL = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const api = baseURL + "api/v2/leave/retract";

        const requestData = {
          leaveRequestId: this.leaveRequestId,
        };

        const response = await axios.post(api, requestData, { headers });

        if (response.status === 200) {
          this.isSuccessful = true;
        } else {
          throw new Error(
            "Failed to retract leave request. Status: " + response.status
          );
        }

        this.leaveRequestId = null;
      } catch (error) {
        console.error("Error retracting leave request:", error);
        this.showErrorMessage(
          error.response?.data?.error?.message || error.message
        );
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    confirmSuccess() {
      this.isSuccessful = false;
      setTimeout(() => {
        window.location.replace(`/suysing_leavehistory`);
      }, 1000);
    },

    updateSelectedLeave(event) {
      const selectedOption = event.target.value;
      const selectedLeave = this.leaveOptionsWithIds.find(
        (option) => option.name === selectedOption
      );

      if (selectedLeave) {
        this.selectedLeaveID = selectedLeave.id;
        this.selectedLeaveType = selectedOption;
      } else {
        this.selectedLeaveID = null;
        this.selectedLeaveType = null;
      }

      this.fetchLeaveBalance(this.selectedLeaveID);
    },

    async fetchLeaveBalance(leaveTypeId) {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const baseURL = localStorage.getItem("baseUrl");
      const api =
        baseURL + `api/v2/leave/leave-balance/leave-type/${leaveTypeId}`;

      try {
        const response = await axios.get(api, { headers });
        const { firstName, lastName, employeeId } = response.data.meta.employee;
        this.employeeDetail = {
          firstName,
          lastName,
          employeeId,
        };

        const { entitled, taken, balance } = response.data.data.balance;
        this.availableBalance = entitled - taken;

        this.employeeDetail2 = {
          entitled,
          balance,
        };
      } catch (error) {
        console.error("Error fetching leave balance:", error);
        this.showErrorMessage("Error fetching leave balance: " + error.message);
      }
    },

    async effectiveDateApply() {},

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
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
  },
  async created() {
    this.checkTokenExpiration();
    this.leaveRequestId = this.$route.query.cardId;
    this.fetchReasonOptions();
    const data = await this.fetchData();
    this.leaveOptionsWithIds = data;
    this.fetchTheme();
    await this.fetchCalendarDisable();
  },
});
</script>

<style scoped>
* {
  font-size: 14px;
  font-family: "Poppins", sans-serif;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.inline-v {
  display: flex;
  flex-direction: column;
}
.card {
  border-radius: 20px;
  padding: 10px;
  margin: 5px 10px;
  box-shadow: 9px 9px 18px #cccccc, -9px -9px 18px #ffffff;
}
.dropdown-label {
  font-weight: bold;
}

.card p {
  font-size: 16px;
  padding: 0;
  margin: 0 0 5px 0;
}

.leavebal-card {
  width: 100%;
  max-width: 300px;
  min-width: 270px;
  margin: 20px auto 0 auto;
}
.leave-bal,
.leave-bal p {
  font-weight: bold;
}

.leave-bal-detail p {
  font-weight: bold;
  margin: 0;
}

.dropdown {
  width: 50%;
  max-width: 250px;
}
.dropdown-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-evenly;
  margin: 0 10px 20px 10px;
}
.calendar-container {
  margin: 20px auto;
  height: 330px;
  width: 330px;
}

.input-text {
  color: #3b3c3e;
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  line-height: normal;
  height: fit-content;
}
.reason-label {
  font-weight: bold;
  width: fit-content;
}
.reason-container {
  margin: 0 auto 50px auto;
  width: fit-content;
  min-width: 300px;
  max-width: 350px;
}

.btn-container {
  margin: 20px 0 50px 0;
}
.content-container {
  max-width: 800px;
  margin: 0 auto;
}
.effective-date-container {
  width: fit-content;
  min-width: 130px;
  margin: 0 auto;
  text-align: center;
}
.effective-date-label {
  font-weight: bold;
  text-align: center;
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
.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  box-shadow: var(--neomorphism-convex-4);
  border-radius: 50%;
  background-color: rgb(246, 246, 246);
  overflow: hidden;
}
</style>
