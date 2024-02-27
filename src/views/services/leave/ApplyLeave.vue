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
              <strong>{{ dateDifference }}</strong>
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

      <ion-card class="neomorphic-card-1 calendar-container">
        <Calendar
          :disabledDates="this.disabledDates_"
          @selectedDatesChanged="updateSelectedDates"
        />
      </ion-card>

      <!-- Reason Card -->
      <div class="reason-container">
        <p class="reason-label" :style="{ color: theme.primaryColor }">
          Reason
        </p>

        <ion-textarea
          color="#E8E8E8"
          label="Type your reason here"
          labelPlacement="floating"
          placeholder="Your reason..."
          v-model="reason"
          class="neomorphic-textarea-1"
        ></ion-textarea>
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

const baseURL = GlobalConstants.HOST_URL;

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
      headerTitle: "Apply Leave",
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
      reason: null,
      employeeDetail: { firstName: "-", employeeId: "-" },
      employeeDetail2: { entitled: "- -", balance: "0" },
      hasLeaveType: true,
      durations: [
        { key: "full_day", label: "Full Day" },
        { key: "half_day", label: "Half Day" },
      ],
      disabledDates_: [],
      selectedDates_: [],
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
      let differenceInDays = this.selectedDates_
        ? this.selectedDates_.length
        : 0;

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
    updateSelectedDates({ selectedDates, month, year }) {
      this.selectedDates_ = selectedDates;
      this.fetchCalendarDisable(month, year);
    },
    async fetchData() {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          console.error("Token not available.");
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = baseURL + `api/v2/leave/leave-types`;
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
        this.store.commit("loader/updateLoader", false);
      }
    },

    async fetchCalendarDisable(month, year) {
      try {
        const storedToken = localStorage.getItem("token");

        if (month === undefined || year === undefined) {
          const currentDate = new Date();
          month = currentDate.getMonth() + 1;
          year = currentDate.getFullYear();
        }

        if (!storedToken) {
          console.error("Token not available.");
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const authToken = `Bearer ${storedToken}`;
        const apiUrl =
          baseURL + `api/v2/leave/disabledDates?month=${month}&year=${year}`;
        const headers = {
          Authorization: authToken,
        };
        const response = await axios.get(apiUrl, { headers });

        this.disabledDates_ = response.data.data;
      } catch (error) {
        console.error(error.message);
      }
    },

    async sendLeaveRequest() {
      try {
        // Check if required fields are empty or null
        if (
          !this.selectedDates_ ||
          !this.durationSelectedValue ||
          !this.selectedLeaveID
        ) {
          this.showErrorMessage(
            "Invalid Leave request. Please fill in all required fields."
          );
          return;
        }

        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const api = baseURL + "api/v3/leave/leave-requests";

        const requestData = {
          filedDates: this.selectedDates_,
          duration: this.durationSelectedValue,
          comment: this.reason,
          leaveTypeId: this.selectedLeaveID,
        };

        const response = await axios.post(api, requestData, { headers });

        this.store.commit("loader/updateLoader", false);
        const toast = await toastController.create({
          message: "Leave request sent successfully!",
          duration: 3000,
          position: "top",
          color: "light",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });

        this.reason = null;
        this.durationSelectedValue = null;
        this.selectedLeaveID = null;
        this.selectedDates_ = null;

        await toast.present();
        this.router.push("/leave");
      } catch (error) {
        console.error("Error sending leave request:", error);
        this.showErrorMessage(
          "An error occurred: " + error.response?.data?.error?.message
        );
      }
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

        const { entitled, balance } = response.data.data.balance;
        this.employeeDetail2 = {
          entitled,
          balance,
        };
      } catch (error) {
        console.error("Error fetching leave balance:", error);
        this.showErrorMessage("Error fetching leave balance: " + error.message);
      }
    },
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
    this.fetchCalendarDisable();
    const data = await this.fetchData();
    this.leaveOptionsWithIds = data;
    this.fetchTheme();
    this.store.commit("loader/updateLoader", false);
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
  margin: 0 auto;
  width: fit-content;
}

.btn-container {
  margin: 20px 0 50px 0;
}
</style>
