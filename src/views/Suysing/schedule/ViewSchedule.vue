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

      <ion-modal :is-open="isOpen">
        <ion-header
          class="header"
          :style="{ backgroundColor: theme.primaryColor }"
        >
          <ion-icon
            name="arrow-back-outline"
            class="icon1"
            router-direction="forward"
            @click="setOpen(false)"
          ></ion-icon>

          <h2 class="title">{{ headerTitle }}</h2>

          <ion-icon
            name="notifications"
            class="icon2"
            color="light"
            @click="rotateIcon"
            :class="{ rotateIcon: rotationState === 'rotateIcon' }"
            :key="rotationState"
          ></ion-icon>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="modalData.length">
            <h3
              class="date-details-title"
              :style="{ color: theme.primaryColor }"
            >
              <strong>Date Details</strong>
            </h3>
            <ion-card
              v-for="date in modalData"
              :key="date.start"
              class="modal-card"
            >
              <div class="details-row">
                <h4><strong>Schedule:</strong></h4>
                <div class="data-details">
                  <div v-if="formatDate(date.start) === formatDate(date.end)">
                    <p><strong>Date: </strong>{{ date.date }}</p>
                  </div>
                  <div v-else>
                    <p>
                      <strong>From: </strong>{{ date.date }}

                      {{ date.time }}

                      <br />
                      <strong>To: </strong>{{ date.date }}
                      {{ date.time }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                :style="{ backgroundColor: date.backgroundColor }"
                class="workShift-color"
              >
                {{ date.title }}
              </div>
            </ion-card>
          </div>
          <div v-else>
            <p color="medium">No matching dates found.</p>
          </div>
        </ion-content>
      </ion-modal>
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
  IonTitle,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonModal,
  IonIcon,
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
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonModal,
    IonIcon,
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
      isOpen: false,
      selectedDateData: [],
      modalData: [],
      rotationState: "initial",
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

      let filteredEntries = [];
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
        filteredEntries = mergedEntries;
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
        filteredEntries = mergedEntries;
      } else if (this.selectedOption === "Others") {
        filteredEntries = this.scheduleData.filter(
          (entry) =>
            entry.title !== "Actual IN" &&
            entry.title !== "Actual OUT" &&
            entry.title !== "Schedule IN" &&
            entry.title !== "Schedule OUT"
        );
      } else {
        filteredEntries = this.scheduleData;
      }

      return filteredEntries
        .map((entry) => this.mapEntry(entry))
        .sort((a, b) => new Date(a.start) - new Date(b.end));
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
        date: new Date(entry.start).toISOString().split("T")[0],
        formattedStartTime: this.safeFormatDate(entry.start),
        formattedEndTime: this.safeFormatDate(entry.end),
        title: entry.title,
        start: entry.start,
        end: entry.end,
        borderColor: entry.backgroundColor,
        backgroundColor: entry.backgroundColor,
        tooltipTitle: entry.tooltipTitle,
        tooltipContent: entry.tooltipContent,
        scheduleColor: entry.tooltipContent,
        textColor: textColor,
        type: entry.type,
      };
    },
    setOpen(open) {
      this.isOpen = open;
    },

    // Only one isDarkColor method needed here
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

    async handleMonthChange(event) {
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
      // this.requestAttendanceData();
      await this.requestData();
      this.selectedDateModal(selectedDate);
    },

    selectedDateModal(selectedDate) {
      const selected = new Date(selectedDate);
      const formattedSelectedDate = `${selected.getFullYear()}-${(
        selected.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${selected.getDate().toString().padStart(2, "0")}`;

      const matchingDates = this.filteredHighlightedDates.filter(
        (item) => item.start?.split("T")[0] === formattedSelectedDate
      );

      this.modalData = matchingDates;
      this.isOpen = true;
    },

    async InitDisplayDate(event) {
      const selectedDate = new Date(event);

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
      await this.requestData();
    },

    formatDate(date) {
      return date.toISOString().split("T")[0];
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

    safeFormatDate(dateString) {
      const trimmedDateString = dateString.trim();

      const ampmRegex = /(\d{1,2}:\d{2}\s?[AP]M)/;
      const tFormatRegex = /T(\d{2}:\d{2})?/;

      function extractDatePart(dateStr) {
        return dateStr.split("T")[0];
      }

      if (ampmRegex.test(trimmedDateString)) {
        const timeMatch = trimmedDateString.match(ampmRegex);
        if (timeMatch && timeMatch[1]) {
          const datePart = extractDatePart(trimmedDateString);
          return {
            date: datePart || "Date not found",
            time: timeMatch[1],
          };
        } else {
          return "Invalid date format (AM/PM)";
        }
      } else if (tFormatRegex.test(trimmedDateString)) {
        const datePart = extractDatePart(trimmedDateString);
        const timeMatch = trimmedDateString.match(tFormatRegex);

        if (!timeMatch[1]) {
          return {
            date: datePart,
            time: null,
          };
        }

        return {
          date: datePart || "Date not found",
          time: timeMatch[1],
        };
      } else {
        return {
          date: dateString,
          time: null,
        };
      }
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

    navigateNotification() {
      this.setOpen(false);
      this.$router.push("/notification");
    },

    async rotateIcon() {
      this.rotationState = "rotateIcon";
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.navigateNotification();
      this.rotationState = "initial";
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

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    await this.InitDisplayDate(formattedDate);
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
.modal-card {
  height: fit-content;
  padding: 15px;
  border-radius: 10px;
  margin: 10px 0;
}
.data-details {
  margin-left: 30px;
}
.date-details-title {
  text-align: center;
  margin: 10px 0 20px 0;
}
/* Modal Header */
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.header {
  background-color: var(--ion-color-blue-theme);
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 40px 40px;
  padding: 0 29px;
  box-shadow: none;
  text-align: center;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.icon1 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
  transition: transform 0.2s ease;
}
.icon1:hover {
  transform: scale(0.5);
}
.icon2 {
  right: 20px;
  font-size: 25px;
  border-radius: 100%;
  padding: 3px;
  color: var(--ion-color-primary-contrast);

  transition: transform 0.7s ease;
}

.title {
  color: var(--ion-color-primary-contrast);
  text-align: center;
  font-family: var(--ion-font-font2);
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.settings-icon {
  font-size: 25px;
  transition: transform 0.7s ease;
}

.settings-icon:hover {
  transform: rotate(360deg);
}

ion-popover {
  --width: fit-content;
}
.btn {
  margin: 0;
  height: 50px;
  width: 150px;
}
.logout-btn {
  background-color: #12a3da;
}

.rotateIcon {
  animation: rotateKeyframes 0.3s ease-in-out;
}

@keyframes rotateKeyframes {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(20deg);
  }
}
</style>
