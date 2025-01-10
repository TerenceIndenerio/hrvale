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
        <!-- Leave Type -->
        <div class="dropdown">
          <p class="dropdown-label" :style="{ color: theme.primaryColor }">
            Leave Type
          </p>
          <ion-select
            label="Select Leave Type"
            label-placement="floating"
            class="neomorphic-input-2 dropdown-input"
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

        <div class="leave-details-container">
          <!-- checkbox -->
          <p class="dropdown-label" :style="{ color: theme.primaryColor }">
            Allocated Days
          </p>
          <div class="checkbox-container">
            <ion-checkbox label-placement="end">
              <p>Calendar</p>
            </ion-checkbox>
            <ion-checkbox label-placement="end">
              <p>Working Days</p>
            </ion-checkbox>
          </div>
          <ion-grid>
            <!-- Leave Balance -->
            <ion-row class="leave-bal-detail">
              <ion-col size="6">
                <p :style="{ color: theme.primaryColor }">Leave Balance:</p>
              </ion-col>
              <ion-col size="5">
                <p>{{ employeeDetail2.balance }} day(s)</p>
              </ion-col>
            </ion-row>

            <ion-row class="leave-bal-detail">
              <ion-col size="6">
                <p :style="{ color: theme.primaryColor }">Leave Start:</p>
              </ion-col>
              <ion-col size="5">
                <input
                  type="date"
                  v-model="dateStart"
                  class="neomorphic-input-2 date-input"
                />
              </ion-col>
            </ion-row>

            <ion-row class="leave-bal-detail">
              <ion-col size="6">
                <p :style="{ color: theme.primaryColor }">Leave End:</p>
              </ion-col>
              <ion-col size="5">
                <input
                  type="date"
                  v-model="dateEnd"
                  @change="handleCalendarChange"
                  class="neomorphic-input-2 date-input"
                />
              </ion-col>
            </ion-row>

            <!-- Duration Days -->
            <ion-row class="leave-bal-detail">
              <ion-col size="6">
                <p :style="{ color: theme.primaryColor }">Duration (Days):</p>
              </ion-col>
              <ion-col size="5">
                <p>
                  <strong>{{ this.valueDates.length }}</strong>
                </p>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <ion-card class="neomorphic-card-1 calendar-container">
          <ion-datetime
            presentation="date"
            :multiple="true"
            :value="this.valueDates"
            :highlighted-dates="this.combinedDates"
            @ionChange="handleCalendarChange"
            readonly
          >
          </ion-datetime>
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
  IonCheckbox,
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
    IonCheckbox,
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
      selectedReason: null,
      effectiveDate: null,
      isSuccessful: false,
      availableBalance: 0,
      hundredDays: [],
      leaveTypeOptions: ["Office Employee", "Sample 100 Days"],
      reasonOptions: [],
      reason: null,
      employeeDetail: { firstName: "-", employeeId: "-" },
      employeeDetail2: { entitled: "- -", balance: "0" },
      hasLeaveType: true,
      durations: [{ key: "full_day", label: "Full Day" }],
      disabledDates_: [],
      selectedDates_: [],
      highlightedDates: [],
      combinedDates: [],
      valueDates: [],
      dateStart: new Date().toISOString().split("T")[0],
      dateEnd: new Date().toISOString().split("T")[0],
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

    handleCalendarChange() {
      if (this.dateStart && this.dateEnd) {
        const startDate = new Date(this.dateStart);
        const endDate = new Date(this.dateEnd);

        if (startDate <= endDate) {
          let selectedDates = [];
          let currentDate = new Date(startDate);

          while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split("T")[0];

            if (!this.disabledDates_.some((d) => d.date === dateStr)) {
              selectedDates.push(dateStr);
            }

            currentDate.setDate(currentDate.getDate() + 1);
          }

          this.valueDates = selectedDates;
        } else {
          console.error("Start date must be before or equal to the end date");
        }
      }
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
              backgroundColor: "#85261F",
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
          duration: "Full Day",
          comment: this.selectedReason,
          leaveTypeId: this.selectedLeaveID,
        };

        const response = await axios.post(api, requestData, { headers });

        if (response.status === 200) {
          this.isSuccessful = true;
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
        this.showErrorMessage(error.response?.data?.error?.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
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

    confirmSuccess() {
      this.isSuccessful = false;
      setTimeout(() => {
        window.location.replace(`/suysing_leavehistory`);
      }, 1000);
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
  max-width: 300px;
}
.dropdown-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-evenly;
  margin: 0 10px 20px 10px;
  text-align: center;
}
.calendar-container {
  margin: 20px auto;
  height: 350px;
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
  text-align: center;
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
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
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
.leave-details-container {
  width: 300px;
}
.checkbox-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.dropdown-input {
  border-radius: 10px;
  width: 300px;
  height: fit-content;
}
.date-input {
  width: 150px;
  border-radius: 5px;
  outline: none;
  border: 1px solid gray;
}
</style>
