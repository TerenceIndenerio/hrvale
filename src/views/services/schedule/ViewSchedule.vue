<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <ion-card class="box-container">
        <h4>In: {{ punchInText }}</h4>

        <h4>Out: {{ punchOutText }}</h4>
      </ion-card>

      <ion-card class="box-container">
        <p><strong>Select a date to show date details. </strong></p>
      </ion-card>

      <div class="calendar-container border-style" v-if="selectedMonth">
        <ion-datetime
          class="date"
          presentation="date"
          display-timezone="false"
          v-model="selectedDate"
          @ionChange="handleMonthChange"
          :highlighted-dates="highlightedDates"
        ></ion-datetime>
      </div>

      <div class="date-details-card">
        <ion-card-header>
          <ion-card-title class="ion-text-center"
            ><strong>Date Details</strong></ion-card-title
          >
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="date in highlightedDates" :key="date.id">
              <div class="details-container">
                <h2 class="ion-text-center ion-text-uppercase ion-text-bold">
                  {{ date.scheduleDate.date.split(" ")[0] }}
                </h2>
                <div
                  :style="{ backgroundColor: date.scheduleColor }"
                  class="workShift-color"
                >
                  {{ date.code }}
                </div>

                <ion-note>
                  <p class="ion-text-justify">
                    <strong>Actual In & Out:</strong>
                    {{ date.punchIn }} -
                    {{ date.punchOut }}
                  </p>
                  <p class="ion-text-justify">
                    <strong>Regular Work Hours:</strong>
                    {{ date.regularWorkHourStart }} -
                    {{ date.regularWorkHourEnd }}
                  </p>
                  <p class="ion-text-justify">
                    <strong>AM Break:</strong> {{ date.amBreakStart }} -
                    {{ date.amBreakEnd }}
                  </p>
                  <p class="ion-text-justify">
                    <strong>Lunch Break:</strong> {{ date.lunchBreakStart }} -
                    {{ date.lunchBreakEnd }}
                  </p>
                  <p class="ion-text-justify">
                    <strong>PM Break:</strong> {{ date.pmBreakStart }} -
                    {{ date.pmBreakEnd }}
                  </p>
                  <p class="ion-text-justify">
                    <strong>Fixed OT Hour:</strong> {{ date.fixedOtHour }}
                  </p>
                </ion-note>
              </div>
            </ion-item>
          </ion-list>
        </ion-card-content>
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
  IonNote,
  IonCardContent,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { IonDatetime } from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;
// const empNumber = GlobalConstants.EMPLOYEE_ID;

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
    IonNote,
    IonCardContent,
    IonLabel,
    IonCardHeader,
    IonCardTitle,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      selectedMonth: new Date().toISOString(),
      selectedDate: new Date().toISOString(),
      headerTitle: "Schedule",
      buttonText: "Request Schedule",
      month: 0,
      scheduleData: [],
      attendance: [],
      punchInText: "00:00",
      punchOutText: "00:00",
      theme: {},
      firstDate: "",
      endDate: "",
      loading: true,
      year: "",
      empNumber: "",
    };
  },
  computed: {
    highlightedDates() {
      return this.scheduleData
        .map((entry) => ({
          id: entry.id,
          scheduleDate: entry.scheduleDate,
          date: entry.scheduleDate.date.split(" ")[0],
          backgroundColor: entry.workShift.scheduleColor,
          regularWorkHourStart: entry.regularWorkHourStart,
          regularWorkHourEnd: entry.regularWorkHourEnd,
          amBreakStart: entry.amBreakStart,
          amBreakEnd: entry.amBreakEnd,
          lunchBreakStart: entry.lunchBreakStart,
          lunchBreakEnd: entry.lunchBreakEnd,
          pmBreakStart: entry.pmBreakStart,
          pmBreakEnd: entry.pmBreakEnd,
          fixedOtHour: entry.fixedOtHour,
          code: entry.workShift.code,
          scheduleColor: entry.workShift.scheduleColor,
          punchIn: entry.punchIn,
          punchOut: entry.punchOut,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.scheduleDate.date);
          const dateB = new Date(b.scheduleDate.date);

          return dateA - dateB;
        });
    },
  },
  methods: {
    dateDetails(date) {
      return `
        Regular Work Hours: ${date.regularWorkHourStart} - ${date.regularWorkHourEnd}
        AM Break: ${date.amBreakStart} - ${date.amBreakEnd}
        Lunch Break: ${date.lunchBreakStart} - ${date.lunchBreakEnd}
        PM Break: ${date.pmBreakStart} - ${date.pmBreakEnd}
        Fixed OT Hour: ${date.fixedOtHour}
      `;
    },
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
        await this.checkTokenExpiration();
        const storedToken = localStorage.getItem("_token");

        const authToken = `Bearer ${storedToken}`;
        const apiUrl = new URL(baseURL + 'api/v2/ess/employee-schedule');
        const queryParams = new URLSearchParams({
          empNumber: this.empNumber,
          month: this.month,
          year: this.year,
        });

        apiUrl.search = queryParams.toString();

        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl.toString(), { headers });

        this.scheduleData = response.data.data;

        this.scheduleData = this.scheduleData.map((scheduleEntry) => {
          const matchingAttendance = this.attendance.find(
            (attendanceEntry) =>
              attendanceEntry.scheduleDate ===
              scheduleEntry.scheduleDate.date.split(" ")[0]
          );

          return {
            ...scheduleEntry,
            punchIn: matchingAttendance ? matchingAttendance.punchIn : null,
            punchOut: matchingAttendance ? matchingAttendance.punchOut : null,
          };
        });
      } catch (error) {
        console.error("Error:", error);
      }
    },

    handleMonthChange(event) {
      const selectedDate = new Date(event.detail.value);
      const firstDayOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      this.firstDate = this.formatDate(firstDayOfMonth);
      this.endDate = this.formatDate(lastDayOfMonth);

      const datePart = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const selectedMonth = event.detail.value;
      const year = selectedDate.getFullYear();

      this.selectedDate = datePart;
      this.day = day;
      this.month = month;
      this.selectedMonth = selectedMonth;
      this.year = year; 

      const selectedData = this.scheduleData.find(
        (entry) => entry.scheduleDate.date.split(" ")[0] === datePart
      );
      if (selectedData) {
        this.punchInText = selectedData.punchIn;
        this.punchOutText = selectedData.punchOut;
      } else {
        this.punchInTex = "00:00";
        this.punchOutText = "00:00";
      }

      console.log(this.punchInText);
      this.requestAttendanceData();
      this.requestData();
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    async requestAttendanceData() {
      try {
        await this.checkTokenExpiration();
        const storedToken = localStorage.getItem("_token");
        const authToken = `Bearer ${storedToken}`;

        const apiUrl =
          baseURL +
          `api/v2/attendance/employees/${this.empNumber}/records?date=${this.firstDate}&endDate=${this.endDate}`;
        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl, { headers });
        this.attendanceData = response.data.data;

        this.attendance = this.attendanceData.map((entry) => ({
          punchIn: entry.punchIn.userTime,
          punchOut: entry.punchOut.userTime,
          scheduleDate: entry.scheduleDate,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    },

    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },

    // Run On Start
    // async requestData2(currentMonth) {
    //   try {
    //     await this.checkTokenExpiration();
    //     const storedToken = localStorage.getItem("_token");

    //     const authToken = `Bearer ${storedToken}`;
    //     const apiUrl =
    //       baseURL +
    //       `api/v2/ess/employee-schedule?empNumber=${empNumber}&month=${currentMonth}`;
    //     const headers = {
    //       Authorization: authToken,
    //     };

    //     const response = await axios.get(apiUrl, { headers });

    //     this.scheduleData = response.data.data;

    //     const extractedData = this.scheduleData.map((entry) => ({
    //       regularWorkHourStart: entry.regularWorkHourStart,
    //       regularWorkHourEnd: entry.regularWorkHourEnd,
    //       scheduleColor: entry.workShift.scheduleColor,
    //       date: entry.scheduleDate.date.split(" ")[0],
    //       code: entry.workShift.code,
    //       scheduleColor: entry.workShift.scheduleColor,
    //     }));
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // },
  },
  async created() {
    this.empNumber = localStorage.getItem('empNumber');
    this.getTheme();
    const currentMonth = new Date().getMonth() + 1;

    // const data = await this.requestData2(currentMonth);

    this.loading = false;
  },
});
</script>

<style scoped>
ion-card-content {
  padding: 0;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
ion-card-header {
  padding-bottom: 10px;
}
.calendar-container {
  margin: 10px auto;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: none;
}
.calendar-select {
  height: 100px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.date {
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.border-style {
  border: 7px solid rgba(220, 220, 220, 0.581);
  box-shadow: inset 10px 10px 15px #d9dade, inset -10px -10px 15px #ffffff,
    9.91px 9.91px 15px #d9dade, -9.91px -9.91px 15px #ffffff;
}
.sched-container {
  text-align: center;
  border-radius: 30px;
  padding: 0;
}
.sched-container h2 {
  margin: 10px 0 0 0;
  font-weight: bold;
}
.sched-container h3 {
  margin: 0;
}
.box-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  align-items: center;
  flex-direction: row;
  height: fit-content;
  margin: 0 5%;
  border-radius: 20px;
  margin-top: 10px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.box {
  min-width: 100px;
  width: 100%;
  max-width: 200px;
  height: fit-content;
  padding: 10px 20px;
  margin: 10px 0 0 0;
  border-radius: 10px;
  border: 3px solid rgba(220, 220, 220, 0.581);
  border-radius: 20px;
  overflow: hidden;
}
.hint {
  text-align: center;
}
.hint p {
  color: rgba(128, 128, 128, 0.695);
}
.date-details-card {
  margin: 10px;
  padding: 0;
}
.details-container {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.details-container h2 {
  margin: 10px 0;
}
.workShift-color {
  border-radius: 20px 0 0 20px;
  min-width: 50px;
  text-align: center;
  position: absolute;
  right: 0;
  top: 5px;
  padding: 0 10px;
}
.modal {
  position: absolute;
  left: 0;
  right: 0;
  top: 50vh;
  max-height: 40vh;
  border-radius: 20px;
  margin: 10px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.modal-closeBtn {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 30px;
}
</style>
