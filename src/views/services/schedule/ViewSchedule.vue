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
        <ion-select
          v-model="selectedOption"
          label="Select Type of Details"
          label-placement="floating"
          class="select-option neomorphic-input-2"
        >
          <ion-select-option
            v-for="option in dropdownOptions"
            :value="option"
            :key="option"
          >
            {{ option }}
          </ion-select-option>
        </ion-select>
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
          :highlighted-dates="filteredHighlightedDates"
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
            <ion-item v-for="date in filteredHighlightedDates" :key="date.id">
              <div class="details-container">
                <h2 class="ion-text-center ion-text-uppercase ion-text-bold">
                  <!-- {{ date.scheduleDate.date.split(" ")[0] }} -->
                </h2>
                <div
                  :style="{ backgroundColor: date.backgroundColor }"
                  class="workShift-color"
                >
                  {{ date.title }}
                </div>
                <ion-note class="details-note">
                  <div class="details-row">
                    <strong>Title:</strong>
                    <div>{{ date.title }}</div>
                  </div>
                  <div class="details-row">
                    <strong>Date:</strong>
                    <div>
                      <template
                        v-if="formatDate(date.start) === formatDate(date.end)"
                      >
                        <div>
                          {{ date.date.split(" ")[0] }}
                        </div>
                      </template>
                      <template v-else>
                        {{ formatDate(date.start.split(" ")[0]) }}
                        {{ date.formattedStartTime }} -
                        <br />
                        {{ formatDate(date.end.split(" ")[0]) }}
                        {{ date.formattedEndTime }}
                      </template>
                    </div>
                  </div>
                  <div
                    class="details-row"
                    v-if="formatDate(date.start) === formatDate(date.end)"
                  >
                    <strong>Time:</strong>
                    <div>
                      {{ date.formattedStartTime }} -
                      {{ date.formattedEndTime }}
                    </div>
                  </div>
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
  IonSelect,
  IonSelectOption,
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
    IonSelect,
    IonSelectOption,
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
      selectedOption: "Others",
      dropdownOptions: ["Actual In & Out", "Schedule In & Out", "Others"],
      highlightedDates: [],
    };
  },
  computed: {
    filteredHighlightedDates() {
      const groupEntriesByDate = (entries) => {
        const grouped = {};

        entries.forEach((entry) => {
          const date = new Date(entry.start).toISOString().split("T")[0];
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(entry);
        });

        return grouped;
      };

      const mergeEntries = (
        groupedEntries,
        inTitle,
        outTitle,
        combinedTitle
      ) => {
        const merged = [];

        Object.keys(groupedEntries).forEach((date) => {
          const entries = groupedEntries[date];
          const entryIn = entries.find((entry) => entry.title === inTitle);
          const entryOut = entries.find((entry) => entry.title === outTitle);

          if (entryIn && entryOut) {
            merged.push({
              title: combinedTitle,
              start: entryIn.start,
              end: entryOut.end,
              borderColor: entryIn.borderColor,
              backgroundColor: entryIn.backgroundColor,
              tooltipTitle: entryIn.tooltipTitle,
              tooltipContent: entryIn.tooltipContent,
              isHoliday: entryIn.isHoliday,
            });
          } else {
            merged.push(...entries);
          }
        });

        return merged;
      };

      if (this.selectedOption === "Actual In & Out") {
        const actualEntries = this.scheduleData.filter(
          (entry) => entry.title === "Actual IN" || entry.title === "Actual OUT"
        );

        const groupedEntries = groupEntriesByDate(actualEntries);
        const mergedEntries = mergeEntries(
          groupedEntries,
          "Actual IN",
          "Actual OUT",
          "Actual IN and OUT"
        );

        return mergedEntries
          .map((entry) => this.mapEntry(entry))
          .sort((a, b) => new Date(a.start) - new Date(b.end));
      } else if (this.selectedOption === "Schedule In & Out") {
        const scheduleEntries = this.scheduleData.filter(
          (entry) =>
            entry.title === "Schedule IN" || entry.title === "Schedule OUT"
        );

        const groupedEntries = groupEntriesByDate(scheduleEntries);
        const mergedEntries = mergeEntries(
          groupedEntries,
          "Schedule IN",
          "Schedule OUT",
          "Schedule IN and OUT"
        );

        return mergedEntries
          .map((entry) => this.mapEntry(entry))
          .sort((a, b) => new Date(a.start) - new Date(b.end));
      } else if (this.selectedOption === "Others") {
        return this.scheduleData
          .filter(
            (entry) =>
              entry.title !== "Actual IN" &&
              entry.title !== "Actual OUT" &&
              entry.title !== "Schedule IN" &&
              entry.title !== "Schedule OUT"
          )
          .map((entry) => this.mapEntry(entry))
          .sort((a, b) => new Date(a.start) - new Date(b.end));
      } else {
        return this.scheduleData
          .map((entry) => this.mapEntry(entry))
          .sort((a, b) => new Date(a.start) - new Date(b.end));
      }
    },
  },
  methods: {
    mapEntry(entry) {
      let backgroundColor = entry.backgroundColor;
      let textColor = "#FFFFFF";

      if (this.isDarkColor(backgroundColor)) {
        textColor = "#FFFFFF";
      } else {
        textColor = "#161716";
      }

      return {
        id: entry.id,
        date: this.formatDate(entry.start),
        formattedStartTime: this.formatTime(entry.start),
        formattedEndTime: this.formatTime(entry.end),
        title: entry.title,
        start: entry.start,
        end: entry.end,
        borderColor: entry.backgroundColor,
        backgroundColor: backgroundColor,
        tooltipTitle: entry.tooltipTitle,
        tooltipContent: entry.tooltipContent,
        scheduleColor: entry.tooltipContent,
        textColor: textColor,
      };
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    formatTime(date) {
      const options = { hour: "2-digit", minute: "2-digit", hour12: true };
      return new Date(date).toLocaleTimeString(undefined, options);
    },
    isDarkColor(color) {
      const rgb = this.hexToRgb(color);
      if (!rgb) return false;
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      return brightness < 128;
    },
    hexToRgb(hex) {
      let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });

      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    },

    isDarkColor(color) {
      let rgb = parseInt(color.substring(1), 16);
      let r = (rgb >> 16) & 0xff;
      let g = (rgb >> 8) & 0xff;
      let b = (rgb >> 0) & 0xff;

      let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      return luminance < 128;
    },
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

    async requestData() {
      try {
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = new URL(baseURL + "api/v2/calendar/details");
        const queryParams = new URLSearchParams({
          empNumber: this.empNumber,
          dateFrom: this.firstDate,
          dateTo: this.endDate,
        });

        apiUrl.search = queryParams.toString();

        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl.toString(), { headers });

        this.scheduleData = response.data.data;

        this.scheduleData = this.scheduleData.map((scheduleEntry) => {
          const matchingAttendance = this.attendance.find(
            (attendanceEntry) => scheduleEntry.start.split(" ")[0]
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
      this.requestAttendanceData();
      this.requestData();

      console.log();
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, "0");
      let day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    },

    formatDateCalendar(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    async requestAttendanceData() {
      try {
        await this.checkTokenExpiration();
        const storedToken = localStorage.getItem("token");
        const authToken = `Bearer ${storedToken}`;
        const baseURL = localStorage.getItem("baseUrl");

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

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  async created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    const currentMonth = new Date().getMonth() + 1;

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
  width: fit-content;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  align-items: center;
  flex-direction: row;
  height: fit-content;
  margin: 0 auto;
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
  margin: 10px auto;
  padding: 0;
  max-width: 500px;
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
  color: white;
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

.details-note {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 5px;
  width: 90%;
}

.details-row {
  display: contents;
}

.details-row > strong {
  grid-column: 1;
  white-space: nowrap;
}

.details-row > div {
  grid-column: 2;
}

.select-option {
  width: fit-content;
  min-width: 300px;
  background-color: rgba(128, 128, 128, 0.184);
  border-radius: 20px;
  padding: 0 10px;
  margin: 10px auto;
}
</style>
