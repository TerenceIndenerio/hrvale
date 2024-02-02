<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />

    <ion-content :fullscreen="true">
      <Refresher />

      <ion-card class="card-container" v-if="!loading && hasLeaveType">
        <!-- Leave Balance Card -->
        <div v-if="employeeDetail2" class="leaveBal-container">
          <p class="leave-bal">
            Leave Balance: <strong>{{ employeeDetail2.balance }}</strong> Day(s)
          </p>
        </div>

        <div v-else class="leaveBal-container">
          <p class="leave-bal">Leave Balance: <strong>0</strong> Day(s)</p>
        </div>

        <!-- details -->
        <div class="ion-padding">
          <div class="emp-detail-container">
            <div class="emp-detail flex-center">
              <p>Allocated Days:</p>
              <p v-if="employeeDetail2">
                <strong>{{ employeeDetail2.entitled }}</strong>
              </p>
            </div>

            <div class="emp-detail flex-center">
              <p>Total Days:</p>
              <p>
                <strong>{{ dateDifference }}</strong>
              </p>
            </div>
          </div>

          <div class="emp-detail-container">
            <div class="emp-detail flex-center">
              <p>Employee Code</p>

              <p v-if="employeeDetail">
                <strong>{{ employeeDetail.employeeId }}</strong>
              </p>
            </div>
            <div class="emp-detail flex-center">
              <p>Name</p>
              <p v-if="employeeDetail">
                <strong
                  >{{ employeeDetail.firstName }} {{ employeeDetail.lastName }}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <!-- Leave Type Card -->
        <ion-card class="card leave-type">
          <p class="margin-l">Leave Type</p>
          <ion-select
            label="Select Leave Type"
            label-placement="floating"
            class="box-container select-option"
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
        </ion-card>
        <br />

        <!-- Duration -->
        <ion-card class="card" id="duration">
          <p class="margin-l">Duration</p>
          <ion-select
            label="Select Duration"
            label-placement="floating"
            v-model="durationSelectedValue"
            class="box-container select-option"
          >
            <ion-select-option
              v-for="duration in durations"
              :key="duration.key"
              :value="duration.key"
            >
              {{ duration.label }}
            </ion-select-option>
          </ion-select>
        </ion-card>

        <Calendar
          :disabledDates="this.disabledDates_"
          @selectedDatesChanged="updateSelectedDates"
        />

        <!-- Reason Card -->
        <ion-card class="card">
          <div class="inline-v">
            <p class="margin-l">Reason</p>
            <div class="box-container">
              <ion-textarea
                color="#E8E8E8"
                label="Type your reason here"
                labelPlacement="floating"
                placeholder="Your reason..."
                v-model="reason"
                class="reason-container"
              ></ion-textarea>
            </div>
          </div>
        </ion-card>

        <!-- Apply Leave Button -->
        <div class="flex-center">
          <ion-button
            class="btn"
            @click="sendLeaveRequest"
            color="none"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
            >Apply Leave</ion-button
          >
        </div>
      </ion-card>
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
      employeeDetail2: { entitled: "-", balance: "0" },
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

        const storedToken = localStorage.getItem("_token");

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
        const storedToken = localStorage.getItem("_token");

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
        const token = localStorage.getItem("_token");
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
      } catch (error) {
        console.error("Error sending leave request:", error);
        this.showErrorMessage(
          "An error occurred: " + error.response?.data?.error?.message
        );
      } finally {
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
      const token = localStorage.getItem("_token");
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
    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
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

    // Exppiration of token
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
  },
  async created() {
    this.checkTokenExpiration();
    this.fetchCalendarDisable();
    const data = await this.fetchData();
    this.leaveOptionsWithIds = data;
    this.getTheme();
    this.store.commit("loader/updateLoader", false);
  },
});
</script>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.flex-w {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.inline-v {
  display: flex;
  flex-direction: column;
}
.fit-w {
  width: 100%;
  height: fit-content;
}
.vh {
  height: 50vh;
}
.card-container {
  border-radius: 20px;
  padding: 10px 0 20px 0;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.card {
  border-radius: 20px;
  padding: 10px;
  margin: 5px 10px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.date-container {
  width: fit-content;
}

.card p {
  font-size: 16px;
  padding: 0;
  margin: 0 0 5px 0;
}
.leaveBal-container {
  width: fit-content;
  margin: 0 auto;
}
.leave-bal {
  font-size: 14px;
}
.emp-detail-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
}
.emp-detail {
  margin: 5px;
  min-width: 150px;
  min-height: 50px;
  justify-content: start;
}

.leave-type {
  margin: 0 10px;
}
.date-picker {
  border-radius: 20px;
  padding: 5px 10px;
  width: fit-content;
  min-width: 100px;
  height: 30px;
  padding: 0;
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

.select-option {
  width: 100%;
  padding: 0 10px;
}
.specific-time-card {
  width: fit-content;
}
.specific-time {
  border-radius: 10px;
  width: fit-content;
  min-width: 100px;
}
.specific-time-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.input-text {
  color: #3b3c3e;
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  line-height: normal;
  height: fit-content;
}
.reason-container {
  height: 90px;
  overflow-y: scroll;
  padding: 0 10px;
}
.btn {
  border-radius: 15px;
  width: fit-content;
  height: 50px;
  overflow: hidden;
  font-family: "Inter";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  margin-top: 20px;
  --background: #12a3da;
}
</style>
